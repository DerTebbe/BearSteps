import {Component, ElementRef, ViewChild} from '@angular/core';
import {Room} from '../models/Room';
import {RoomService} from '../services/room.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {User} from '../models/User';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';

/*
necessary var so google is not undefined
 */
/**
 * @ignore
 */
declare var google: any;


/**
 * Page to which players are directed if the game ends some how
 */
@Component({
    selector: 'app-game-end',
    templateUrl: './game-end.page.html',
    styleUrls: ['./game-end.page.scss'],
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

export class GameEndPage {

    @ViewChild('map, {read: Elementref, static; false}') mapRef: ElementRef;

    /**
     * Google map on which markers and circle are shown
     */
    map: any;
    /**
     * Circle that is displayed on map
     */
    circle: any;
    /**
     * Room object of the game the end page corresponds to
     */
    room: Room;
    /**
     * Arraycontaining the players of the game. Retrieved from players subcollection in room document
     */
    players: User[];
    /**
     * Logged in user that is currently viewing the page
     */
    user: User;
    /**
     * ID of the room the game end page corresponds to
     */
    roomID: string;
    /**
     * role of the logged in user that is currently viewing the page
     */
    role: string;
    /**
     * Subscription to the room document in firebse is stored in this attribute
     */
    roomSubscription: Subscription;
    /**
     * Subscription to the players subcollection in room document in firebse is stored in this attribute
     */
    playerSubscription: Subscription;
    /**
     * Subscription to the logged in user is stored in this attribute
     */
    userSubscription: Subscription;
    /**
     * Text that is shown on top of the page. Depends on role of the logged in user and the result of the game
     */
    headerText = '';
    /**
     * Text that represents ho the game ended. E.g.: Mr.X was catched by a detective
     */
    endType = '';
    /**
     * Amount of time the game lasted
     */
    timePlayed: string;
    /**
     * Message that is displayed in the winning animation. Depends on role of the logged in user and the result of the game
     */
    winMessage = '';
    /**
     * Message that is displayed in the loosing animation. Depends on role of the logged in user and the result of the game
     */
    defeatMessage = 'You lost you big looser stinky head >:)';
    /**
     * Determines if the winning animation is shown
     */
    displayWin = false;
    /**
     * Determines who won the game
     */
    winner;
    /**
     * Determines if the winning animation is shown
     */
    displayDefeat = false;
    /**
     * Raindrops for loosing animation
     */
    raindrops: number[] = Array(50).fill(0);

    /**
     * Necessary dependencies are injected and URl parameters are feteched
     * @param roomService Service for managing room data in firbase
     * @param authService Service for checking auth State
     * @param router used to navigate betweeen pages
     * @param route used to fetch URl parameters
     * @param userservie Service to for managing user data in firebase
     */
    constructor(private roomService: RoomService,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private userservie: UserService
    ) {
        this.role = this.route.snapshot.paramMap.get('role');
        this.roomID = this.route.snapshot.paramMap.get('roomID');
    }

    /**
     * Calls methods to fetch necessary data from firebase before view enters
     */
    async ionViewWillEnter() {
        try {
            await this.initPlayers();
            await this.initUser();
            await this.initRoom();
        } catch (e) {
            console.error('Error halt');
        }
    }

    /**
     * Subscribes to the logged in user and stores in this.user
     */

    initUser(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.userSubscription = this.authService.observeLoggedInUser().subscribe(user => {
                this.user = user;
                resolve();
            });
        });
    }

    /**
     * Subscribes to players subcollection of the room ans stores it in this.players
     */
    initPlayers(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.playerSubscription = this.roomService.getAllPlayers(this.roomID).subscribe(user => {
                this.players = user;
                resolve();
            });
        });
    }

    /**
     * Subscribes to room document ans stores it in this.room. Methods that user room data are called when room data is fetched
     */
    initRoom(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.roomSubscription = this.roomService.find(this.roomID).subscribe(action => {
                this.room = action.payload.data();
                this.room.id = action.payload.id;
                this.winner = this.room.game.mrXwon;
                this.timePlayed = this.secondsToHms(this.room.game.timePlayed);
                this.setText();
                this.showMap();
                this.setMarker();
                this.calculateStatistics();
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
     * Sets the texts that are displayed on the page according to the role of the logged in user and the game results
     */
    setText() {
        if (this.role === 'Mr.X' && this.room.game.mrXwon) {        // Mr X won, time over
            this.showWin();
            this.headerText = 'Mr.X hat gewonnen!';
            this.endType = 'Zeitlimit erreicht! Die Detektive haben Mr. X nicht gefunden.';
        } else if (this.role === 'Mr.X' && !this.room.game.mrXwon && this.room.game.mrXLostByLeavingPlayingArea) {      // Mr X lose, out of radius
            this.showDefeat();
            this.headerText = 'Detektive haben gewonnen!';
            this.endType = 'Spielbereich verlassen! Mr. X war zu lange außerhalb des Radius.';
        } else if (this.role === 'Mr.X' && !this.room.game.mrXwon && !this.room.game.mrXLostByLeavingPlayingArea) {     // Mr X lose, catchword
            this.showDefeat();
            this.headerText = 'Detektive haben gewonnen!';
            this.endType = 'Mr. X gefunden! Ein Detektiv hat Mr. X gefangen.';
        } else if (this.role === 'Detektiv' && !this.room.game.mrXwon) {                                                // Detective win
            this.showWin();
            if (this.room.game.mrXLostByLeavingPlayingArea) {               // Detective win, Mr X out of radius
                this.headerText = 'Detektive haben gewonnen!';
                this.endType = 'Spielbereich verlassen! Mr. X war zu lange außerhalb des Radius.';
            } else {    // Detective win, catchword
                this.headerText = 'Detektive haben gewonnen!';
                this.endType = 'Mr. X gefunden! Ein Detektiv hat Mr. X gefangen.';
            }
        } else if (this.role === 'Detektiv' && this.room.game.mrXwon) {     // Detective lose
            this.showDefeat();
            this.headerText = 'Mr.X hat gewonnen!';
            this.endType = 'Zeit vorbei! Mr. X konnte nicht gefunden werden.';
        }
    }

    /**
     * Calculates the statistics a user earned by playing the game and calls update method for the user from userService with updated statistics
     */
    calculateStatistics() {
        const hasWon: boolean = (this.role === 'Mr.X' && this.room.game.mrXwon) || (this.role === 'Detektiv' && !this.room.game.mrXwon);
        this.user.statistic.gamesPlayed++;
        if (hasWon) {
            this.user.statistic.gamesWon++;
        }
        if (this.role === 'Mr.X') {
            this.user.statistic.gamesPlayedAsMrX++;
        }
        if (this.role === 'Mr.X' && hasWon) {
            this.user.statistic.gamesWonAsMrX++;
        }
        this.userservie.update(this.user);
    }

    /**
     * Configures map which displays the last location of the players
     */
    showMap() {
        const location = new google.maps.LatLng(this.room.creator.latitude, this.room.creator.longtitude);
        const options = {
            center: location,
            zoom: 15,
            draggable: false,
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
     * Sets the markers of players on the map
     */
    setMarker() {
        const iconDetektiv = {
            url: '../../assets/marker.svg', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
        };


        const iconMrX = {
            url: '../../assets/markerMrX.svg', // image url
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
            } else {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(player.latitude, player.longtitude),
                    map: this.map,
                    icon: iconMrX
                });
                this.setInfoMrX(player, marker);
            }
        }
    }

    /**
     * Sets an info window to the marker of a detectivw with his username
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
     * Sets an info window to the marker of Mr.X with his username
     * @param player Player the marker belongs to
     * @param marker Marker on which the window should be setted
     */
    setInfoMrX(player: User, marker) {
        const content = '<div><p>Position von Mr.X' + '/' + player.username + '</p></div>';
        const infowindow = new google.maps.InfoWindow({
            content,
            maxWidth: 400
        });

        marker.addListener('click', () => {
            infowindow.open(this.map, marker);
        });
    }

    /**
     * Calls methods to delete player from subcollection in room document and if he is the last player in the room the room document is deleted.
     * Navigates to home page
     */

    leaveGame() {
        if (this.players.length > 1) {
            this.roomService.deletePlayer(this.roomID, this.user.id);
        } else {
            this.roomService.deletePlayer(this.roomID, this.user.id);
            this.roomService.delete(this.room);
        }
        this.router.navigate(['home']);
    }

    /**
     * sets a win message
     * shows firework animation
     */
    showWin() {
        if (!(this.role === 'Mr.X')) {
            this.winMessage = (this.room.game.mrXLostByLeavingPlayingArea) ? 'Glückwunsch! Ihr habt gewonnen! Mr. X ist aus dem Spielradius abgehauen.' : 'Glückwunsch! Deine Detektiv-Kollegen und du haben Mr. X gefangen.';
        } else {
            this.winMessage = 'Glückwunsch! Du hast dich erfolgreich vor den Detektiven verstekct.';
        }

        this.displayWin = true;

        setTimeout(() => {
            this.displayWin = false;
        }, 6000);
    }

    /**
     * sets a defeat message
     * shows rain animation
     */
    showDefeat() {
        if (this.role === 'Mr.X') {
            this.defeatMessage = (this.room.game.mrXLostByLeavingPlayingArea) ? 'Du bist aus dem Spielradius herausgelaufen und hast leider verloren.' : 'Du wurdest von den Detektiven entdeckt und gestoppt.';
        } else {
            this.defeatMessage = 'Mr. X ist euch entkommen.';
        }
        this.displayDefeat = true;
        setTimeout(() => {
            this.displayDefeat = false;
        }, 6000);
    }

    /**
     * Unsubscribes from all subscriptions if the page is left
     */
    ionViewWillLeave() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.roomSubscription) {
            this.roomSubscription.unsubscribe();
        }
        if (this.playerSubscription) {
            this.playerSubscription.unsubscribe();
        }
    }

}
