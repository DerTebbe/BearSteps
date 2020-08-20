import {Component, ElementRef, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {RoomService} from '../services/room.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Room} from '../models/Room';
import {User} from '../models/User';
import {GeolocationService} from '../services/geolocation.service';
import {AlertController, ToastController} from '@ionic/angular';
import {animate, group, style, transition, trigger} from '@angular/animations';

/*
necessary var so google is not undefined
 */
/**
 * @ignore
 */
declare var google: any;

/**
 * Page in which the game is actively played
 */
@Component({
    selector: 'app-play',
    templateUrl: './play.page.html',
    styleUrls: ['./play.page.scss'],
    animations: [
        trigger('container', [
            transition(':enter', [
                style({opacity: '0'}),
                group([
                    animate('500ms ease-out', style({opacity: '1'}))
                ])

            ]),
            transition(':leave', [
                group([
                    animate('500ms ease-out', style({opacity: '0'}))
                ])
            ])
        ])
    ]
})

export class PlayPage {

    /**
     * Necessary dependcies are injected and subscription to the player subcollection where the location of the users are stored
     * @param roomservice
     * @param authservice
     * @param route
     * @param locationservice
     * @param router
     * @param alertController
     * @param toastController
     */
    constructor(private roomservice: RoomService,
                private authservice: AuthService,
                private route: ActivatedRoute,
                private locationservice: GeolocationService,
                private router: Router,
                private alertController: AlertController,
                private toastController: ToastController) {

        this.roomID = this.route.snapshot.paramMap.get('roomID');

        this.onSuccess = position => {
            console.log('Position aktualisiert!');
            this.user.longtitude = position.coords.longitude;
            this.user.latitude = position.coords.latitude;
            this.roomservice.updatePlayer(this.roomID, this.user);
        };

        this.onError = error => {
            console.log(error.message);
        };

    }

    /**
     * Subscription of the room
     */
    roomSubscription: Subscription;

    /**
     * Subscription of logged-in player
     */
    userSubscription: Subscription;

    /**
     * Subscription of local location updates
     */
    intervalSubscription: Subscription;

    /**
     * Subscription of Mr.X location updates
     */
    intervalSubscription2: Subscription;

    /**
     * Subscription of room-players locations
     */
    playersSubscription: Subscription;

    /**
     * Room, in which the game is played
     */
    room: Room;

    /**
     * Logged- in user
     */
    user: User = new User();

    /**
     * Active players in room
     */
    players: User[];

    /**
     * Counter that indicated how often Mr.X was out of bounds
     */
    mrXOutOfBounds = 0;

    /**
     * ID of the room in which the games is played
     */
    roomID: string;

    /**
     * Google Map
     */
    map: any;

    /**
     * Circle in maps that indicates playing area
     */
    circle: any;

    /**
     * Indicates game time
     */
    time;

    /**
     * Saves countdown
     */
    interval;

    /**
     * Final time of room
     */
    finalTime;

    /**
     * Indicates if win-message should be displayed
     */
    displayWin = false;

    /**
     * Contains win message
     */
    winMessage = '';

    /**
     * Call back function for the getPosition() method from geolocationservice that is executed on success
     * @param position Object containing information about the location of the user
     */
    onSuccess;

    /**
     * Call back function for the getPosition() method from geolocationservice that is executed if an error occurs
     * @param error Object containing information about the type of error if the retrieval of the location fails
     */
    onError;

    /**
     * Indicates if room is initialised
     */
    init = true;

    /**
     * Contains markers of all players
     */
    marker = [];

    /**
     * Marker of Mr.X
     */
    mrXMarker;

    /**
     * Index of logged-in user in players array
     */
    userIndex: number;

    /**
     * Gets map from html
     */
    @ViewChild('map, {read: Elementref, static; false}') mapRef: ElementRef;

    /**
     * subscribes to the room, players and logged in user object to retrieve necessary data
     * handles the gametimer with inserted amount of Time at start
     */
    async ionViewWillEnter() {
        try {
            await this.initRoom();
            await this.initUser();
            await this.initPlayers();
            if (this.user.role === 'Mr.X') {
                this.presentCatchwordCreate();
                this.time += 180;
            }else {
                this.startTimer();
            }
        } catch (e) {
            console.error('Irgendwas ist in unserer viel zu komplizierten Play-Page voll schiefgelaufen');
        }
    }

    /**
     * Subscribes to room-document
     */
    initRoom(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.roomSubscription = this.roomservice.find(this.roomID).subscribe((action) => {
                this.room = action.payload.data();
                this.room.id = action.payload.id;
                if (this.init) {
                    this.time = this.room.maxAmountTime;
                }
                if (!this.room.started && this.room.creator.id !== this.user.id) {
                    this.showAlert('Spiel abgebrochen', this.room.message);
                    this.router.navigate(['home']);
                }
                if (this.room.game.mrXLostByLeavingPlayingArea) {
                    this.endGame();
                }
                if (this.room.game.mrXwon !== null) {
                    this.endGame();
                }
                resolve();
            });
        });
    }

    /**
     * Subscribes to user-document
     */
    initUser(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.userSubscription = this.authservice.user.subscribe((user: User) => {
                this.user = user;
                this.setUserIndex();
                this.user.role = this.room.players[this.userIndex].role;
                this.updateLocation();
                this.setInterval();
                this.showMap();
                resolve();
            });
        });
    }

    /**
     * Subscribes to players-subcollection
     */
    initPlayers(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.playersSubscription = this.roomservice.getAllPlayers(this.roomID).subscribe((value) => {
                this.players = value;
                if (this.init) {
                    this.refreshMarker();
                    this.refreshMrXMarker();
                    this.init = false;
                } else {
                    this.refreshMarker();
                }
                resolve();
            });
        });
    }

    /**
     * this function formats seconds to h:mm:ss
     * @param time is the imported time, that needs to be formated
     */
    secondsToHms(time) {
        time = Number(time);

        const h = Math.floor(time / 3600);
        const m = Math.floor(time % 3600 / 60);
        const s = Math.floor(time % 3600 % 60);

        return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
    }


    /**
     * sets the interval in which the locations of the players and the marker of Mr.X should be updated
     */
    setInterval() {
        const source = interval(30000);
        this.intervalSubscription = source.subscribe(() => this.updateLocation());

        let source2;
        if (this.user.role === 'Detektiv') {
            source2 = interval(240000);
            this.intervalSubscription2 = source2.subscribe(() => this.refreshMrXMarker());
        } else {
            source2 = interval(30000);
            this.intervalSubscription2 = source2.subscribe(() => this.refreshMrXMarker());
        }
    }

    /**
     * Retrieves the index of the user in players array
     */
    setUserIndex() {
        const check = (element) => element.id === this.user.id;
        this.userIndex = this.room.players.findIndex(check);
    }


    /**
     * updates the location of the user. Persisting of the actual location happens in the callback function onSuccess
     */
    updateLocation() {
        this.locationservice.getPosition(this.onSuccess, this.onError);
    }

    /**
     * Navigates to GameEnd Page
     */
    endGame() {
        this.router.navigate(['game-end', {role: this.user.role, roomID: this.room.id}]);
    }

    /**
     * Sets the necessary informations in the game attribute of room when the game ended somehow
     * Is called when Mr.X was too long outside of the playing area, the time of the game is up or a detective catched Mr.X by entering the right catchword
     * It is either called by the creator of the game (if time is up), Mr.X (if Mr.X too long outside of the playing area) or the detective who catches Mr.X
     * @param mrXLeftArea
     * @param mrXWasCatched
     */
    addGameEndInfo(mrXLeftArea: boolean, mrXWasCatched: boolean) {
        this.room.game.timePlayed = this.room.maxAmountTime - this.time;
        if (mrXLeftArea) {
            this.room.game.mrXLostByLeavingPlayingArea = true;
            this.room.game.mrXwon = false;
        } else if (mrXWasCatched) {
            this.room.game.mrXLostByLeavingPlayingArea = false;
            this.room.game.mrXwon = false;
        } else {
            this.room.game.mrXLostByLeavingPlayingArea = false;
            this.room.game.mrXwon = true;
        }
        this.roomservice.update(this.room);
    }


    /**
     * Configures map with given location of the room-creator
     */
    showMap() {
        const location = new google.maps.LatLng(this.room.creator.latitude, this.room.creator.longtitude);
        const options = {
            center: location,
            zoom: 15,
            disableDefaultUI: true,
            /*
            lots of styling with major our colors
              */
            styles: [
                {elementType: 'geometry', stylers: [{color: '#253031'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#253031'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#FFB35C'}]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#FFB35C'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#263c3f'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#6b9a76'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#38414e'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#212a37'}]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9ca5b3'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#746855'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#1f2835'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#f3d19c'}]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{color: '#2f3948'}]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#17263c'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#515c6d'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#17263c'}]
                }
            ]
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.circle = new google.maps.Circle({
            strokeColor: '#ffffff',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#ff8c00',
            fillOpacity: 0.2,
            map: this.map,
            center: new google.maps.LatLng(this.room.creator.latitude, this.room.creator.longtitude),
            radius: this.room.game.radius
        });
    }

    /**
     * Refreshes the markers of detectives on the map
     */
    refreshMarker() {
        this.setMapOnAll(null);
        this.marker = [];

        const iconDetektiv = {
            url: '../../assets/marker.svg', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
        };
        let marker;
        for (const player of this.players) {
            if (player.role === 'Detektiv') {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(player.latitude, player.longtitude),
                    map: this.map,
                    icon: iconDetektiv
                });
                this.setInfoWindowDetective(player, marker);
                this.marker.push(marker);
            }
        }
        this.setMapOnAll(this.map);
        if (!this.init) {
            if (this.user.role === 'Detektiv') {
                this.presentToast('Die Position von deinen Detektiv Kollegen und dir wurde aktualisiert');
            } else {
                this.presentToast('Die Positionen der Detektive wurden aktualisiert');
            }
        }
    }

    /**
     * refreshes the marker of Mr.X on the map
     */
    refreshMrXMarker() {
        this.setMap(null);
        const iconMrX = {
            url: '../../assets/markerMrX.svg', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
        };

        let marker;
        for (const player of this.players) {
            if (player.role === 'Mr.X') {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(player.latitude, player.longtitude),
                    map: this.map,
                    icon: iconMrX
                });
                this.mrXMarker = marker;
            }
        }
        this.setMap(this.map);
        this.setInfoWindowMrX();

        if (!this.init) {
            if (this.user.role === 'Detektiv') {
                this.showAlert('Update', 'Eine neue Position von Mr.X ist verfügbar');
            } else {
                if (this.circle.getBounds().contains(marker.position)) {
                    this.mrXOutOfBounds = 0;
                    this.presentToast('Deine Position wurde aktualisiert');
                } else {
                    this.mrXOutOfBounds++;
                    if (this.mrXOutOfBounds === 3) {
                        // Spiel vorbei, Detektive gewinnen
                        this.addGameEndInfo(true, false);
                    } else if (this.mrXOutOfBounds === 2) {
                        this.showAlert('Letzte Chance!', 'Zurück in den Spielbereich, du Halunke!');
                    } else {
                        this.showAlert('Vorsicht!', ' Zurück in den Spielbereich oder du verlierst!');
                    }
                }
            }
        }
    }

    /**
     * Removes or sets markers of the detectives on the map
     * @param map Map on which the markers should be placed or null if the marker should be removed
     */
    setMapOnAll(map) {
        for (const marker of this.marker) {
            marker.setMap(map);
        }
    }

    /**
     * Removes or sets marker of Mr.X on the map
     * @param map Map on which the marker should be placed or null if the marker should be removed
     */
    setMap(map) {
        if (this.mrXMarker !== undefined) {
            this.mrXMarker.setMap(map);
        }
    }

    /**
     * Sets an info window to the marker of Mr.X
     * Builds differnet info windows whether the playing user is Mr.X or a detective
     */
    setInfoWindowMrX() {
        let content;
        if (this.user.role === 'Detektiv') {
            content = '<div><p>Letzte bekannte Position von Mr.X</p></div>';
        } else {
            content = '<div><p>Deine Position</p></div>';
        }
        const infowindow = new google.maps.InfoWindow({
            content,
            maxWidth: 400
        });

        this.mrXMarker.addListener('click', () => {
            infowindow.open(this.map, this.mrXMarker);
        });
    }

    /**
     * Sets an info window to the marker of a detective with his username
     * @param player Player the marker belongs to
     * @param marker Marker on which the window should be setted
     */
    setInfoWindowDetective(player: User, marker) {
        const content = '<div><p>Position von Detektiv ' + player.username + '</p></div>';
        const infowindow = new google.maps.InfoWindow({
            content,
            maxWidth: 400
        });

        marker.addListener('click', () => {
            infowindow.open(this.map, marker);
        });
    }

    /**
     * Cancels the game by setting started to false. Also deletes room ans players subcollection from firebase
     */
    cancelGame(message: string) {
        this.room.started = false;
        this.room.message = message;
        this.roomservice.update(this.room);
        this.cleanRoomDocument();
        this.router.navigate(['home']);
    }

    /**
     * Deletes room document and its subcollection
     */
    cleanRoomDocument() {
        for (const player of this.players) {
            this.roomservice.deletePlayer(this.roomID, player.id);
        }
        this.roomservice.delete(this.room);
    }

    /**
     * Unsubscribes from all subscriptions
     */
    ionViewWillLeave() {
        if (this.roomSubscription) {
            this.roomSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
        if (this.playersSubscription) {
            this.playersSubscription.unsubscribe();
        }
        if (this.intervalSubscription2) {
            this.intervalSubscription2.unsubscribe();
        }

        clearInterval(this.interval);

    }

    /**
     * Opens alert window with given header and message
     * @param header Header of the alert window
     * @param message Message of the alert window
     */
    async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                }]
        });
        await alert.present();
    }


    /**
     * Presents a toast when locations are updated
     * @param message Message to display
     */
    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 5000,
            color: 'tertiary',
            cssClass: 'toast',
            position: 'top',
        });
        toast.present();
    }

    /**
     * Opens alert to cancel game with a message
     */
    async showInputAlert() {
        const alert = await this.alertController.create({
            header: 'Spiel abbrechen',
            message: 'Wieso muss das Spiel abgebrochen werden? <br> Lass es alle Mitspieler wissen!',
            inputs: [
                {
                    cssClass: 'dark',
                    name: 'message',
                    type: 'text',
                    placeholder: 'Deine Nachricht'
                }
            ],
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Abschicken',
                    handler: data => {
                        this.cancelGame(data.message);
                    },
                },
                {
                    cssClass: 'dark',
                    text: 'Zurück zum Spiel',
                    role: 'cancel',
                }]
        });
        await alert.present();
    }

    /**
     * shows an alert which prompts the input of the catchword
     * catchword must be between 4 and 24 chars
     * on save: catchword gets saved to the database
     */
    async presentCatchwordCreate() {
        console.log('Hello');
        const alert = await this.alertController.create({
            backdropDismiss: false,
            header: 'Erfinde ein Geheimwort!',
            message: 'Das Wort musst du einem Detektiv mitteilen, wenn er dich gefunden hat!',
            inputs: [
                {
                    cssClass: 'dark',
                    name: 'catchword',
                    placeholder: 'Geheimwort'
                }
            ],
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Speichern',
                    handler: data => {
                        console.log(data.catchword);
                        if (data.catchword.length < 4) {
                            this.showToast('Geheimwort zu kurz! Bitte gib mindestens 4 Zeichen an.', 'danger');
                            return false;
                        } else if (data.catchword.length > 24) {
                            this.showToast('Geheimwort zu lang! Bitte gib maximal 24 Zeichen an.', 'danger');
                            return false;
                        } else {
                            this.room.catchword = data.catchword;
                            this.roomservice.update(this.room);
                            this.startTimer();
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.time > 0) {
                this.time--;
                this.finalTime = this.secondsToHms(this.time);
            } else {
                clearInterval(this.interval);
                if (this.room.creator.id === this.user.id) {
                    this.addGameEndInfo(false, false);
                }
                this.endGame();
            }
        }, 1000);
    }

    /**
     * shows the catchword of the current game
     */
    async presentCatchword() {
        const alert = await this.alertController.create({
            header: 'Geheimwort',
            message:

                ' <ion-text class="ion-align-items-center"> ' +
                ' <h1>' + this.room.catchword +
                ' </h1> ' +
                ' </ion-text> ',

            buttons: [
                {
                    text: 'Schließen',
                    role: 'cancel',
                    cssClass: 'dark',
                }]
        });

        await alert.present();
    }

    /**
     * Alert with an input for the catchword
     * catchword gets checked
     * if catchword is correct: showDetectiveWin()
     * if catchword is wrong: errormessage
     */
    async presentCatchMrX() {
        const alert = await this.alertController.create({
            header: 'Mr. X fangen',
            message: 'Gib hier das Geheimwort von Mr. X ein.',
            inputs: [
                {
                    cssClass: 'dark',
                    name: 'catchword',
                    placeholder: 'Geheimwort'
                }
            ],
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Abbrechen',
                    role: 'cancel',
                },
                {
                    cssClass: 'dark',
                    text: 'Fangen!',
                    handler: data => {
                        if (data.catchword === this.room.catchword) {
                            this.addGameEndInfo(false, true);
                        } else {
                            this.showToast('Fehlschlag! Das war wohl das falsche Wort. Mr. X ist entkommen.', 'danger');
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * shows a message at the top of the screen
     * @param message message
     * @param color color of the toast, signals if error ('danger') or success ('success)
     */
    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            position: 'top',
            color
        });

        toast.present();
    }
}
