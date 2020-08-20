import {Component} from '@angular/core';
import {RoomService} from '../services/room.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Room} from '../models/Room';
import {Subscription} from 'rxjs';
import {User} from '../models/User';
import {AlertController} from '@ionic/angular';
import {ModalController} from '@ionic/angular';
import {GameClosingPage} from '../game-closing/game-closing.page';
import {AuthService} from '../services/auth.service';
import {GeolocationService} from '../services/geolocation.service';

/**
 * Page to invite and (AVENGERS!) assemble all players for a game
 */
@Component({
    selector: 'app-game-lobby',
    templateUrl: './game-lobby.page.html',
    styleUrls: ['./game-lobby.page.scss'],
})

export class GameLobbyPage {

    /**
     * Subscription of the room
     */
    roomSubscription: Subscription;

    /**
     * Subscription of logged in user
     */
    userSubscription: Subscription;

    /**
     * Room in which the game is played
     */
    room: Room = new Room();

    /**
     * Logged in user
     */
    user: User;

    /**
     * Indicated if player has been kicked
     */
    kicked = true;

    /**
     * Inidcates if page is initialising
     */
    init = true;

    /**
     * Saves the old creator of a room to check if creator has changed
     */
    oldCreator: User;

    /**
     * Indicated how many players can join the room
     */
    maxMember = this.room.maxAmountPlayers;

    /**
     * Indicates how many players have joined the rrom
     */
    playerLength = 0;

    /**
     * Id of the room
     */
    roomID: string;

    /**
     * Success handler of interval
     */
    onSuccess;

    /**
     * Error handler of interval
     */
    onError;

    /**
     * Interval to check if location of user is available
     */
    interval;

    /**
     * Indicated if location is available
     */
    locationActivated = false;

    /**
     * Sets success an error handler and subscribes to all needed documents
     * @param roomservice
     * @param route
     * @param modalController
     * @param alertController
     * @param authservice
     * @param router
     * @param locationService
     */
    constructor(private roomservice: RoomService,
                private route: ActivatedRoute,
                private modalController: ModalController,
                public alertController: AlertController,
                private authservice: AuthService,
                private router: Router,
                private locationService: GeolocationService
    ) {
        this.onSuccess = position => {
            this.user.longtitude = position.coords.longitude;
            this.user.latitude = position.coords.latitude;
            this.roomservice.updatePlayer(this.roomID, this.user);
            this.locationActivated = true;
        };

        this.onError = error => {
            if (error.message === 'Timeout expired') {
                this.showAlert('GPS Dienste benötigt', 'Schalte bitte die GPS Dienste deines Handys ein. Nur so kannst du effektiv am Spiel teilnehmen');
            } else if (error.message === 'Illegal Access'){
                this.showAlert('Zugriff verweigert', 'Du hast uns den Zufgriff auf deinen Standort verweigert. So kannst du nicht spielen! Bitte geh in deinen Geräteeinstellungen unter Standort und erlaube BearSteps den Zugriff auf deinen Standort');
            }
        };

        this.roomID = this.route.snapshot.paramMap.get('roomID');
        this.subscribeToUser().then(() => {
            this.subscribeToRoom(this.roomID).then(() => {
                if (!this.loggedInPlayerLeftRoom()) {
                    //
                } else if (this.room.players.length === this.room.maxAmountPlayers) {
                    this.showAlert('Sorry, der Raum ist voll!', 'Leider kannst du nicht mehr beitreten, da der Raum bereits voll ist!');
                    this.router.navigate(['home']);
                } else {
                    if (this.loggedInPlayerLeftRoom()) {
                        this.room.players.push(this.user);
                        this.roomservice.addPlayer(this.room.id, this.user);
                        this.roomservice.update(this.room);
                    }
                }
            });
        });
    }

    /**
     * Check if geolocation of logged in user is available
     */
    ionViewDidEnter() {
        this.locationService.getPosition(this.onSuccess, this.onError);
        if (!this.locationActivated) {
            this.interval = setInterval(() => {
                if (!this.locationActivated) {
                    this.locationService.getPosition(this.onSuccess, this.onError);
                } else {
                    clearInterval(this.interval);
                }
            }, 10000);
        }
    }

    /**
     * Opens an alert window to display the invitation code
     */
    async showAlertInviteCode() {

        const alert = await this.alertController.create({
            header: 'Einladungscode',
            subHeader: 'Sende diesen Code an deine Freunde, um sie einzuladen:',
            message:

                ' <ion-text class="ion-align-items-center"> ' +
                ' <h1>' + this.room.roomNumber +
                ' </h1> ' +
                ' </ion-text> ',


            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'dark',
                }]
        });

        await alert.present();
    }

    /**
     * Subscibes to the logged-in user
     */
    subscribeToUser(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.userSubscription = this.authservice.user.subscribe((user: User) => {
                this.user = user;
                resolve();
            });
        });
    }

    /**
     * Subscribes to the room document to get latest changes
     * @param roomID ID of room to be observed
     */
    subscribeToRoom(roomID: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.roomSubscription = this.roomservice.find(roomID).subscribe((action) => {
                this.room = action.payload.data();
                this.room.id = action.payload.id;
                this.playerLength = this.room.players.length;
                this.maxMember = this.room.maxAmountPlayers;
                if (!this.init) {
                    if (this.loggedInPlayerLeftRoom()) {
                        this.navigateBackHome();
                    }
                    if (this.room.creator.id === this.user.id && this.oldCreator.id !== this.room.creator.id) {
                        this.oldCreator = this.room.creator;
                        this.showAlert('Der Ersteller hat den Raum verlassen', 'Du bist jetzt der neue Admin des Spiels');
                    }
                } else {
                    this.oldCreator = this.room.creator;
                }
                if (this.room.started) {
                    this.router.navigate(['player-info', {roomID: this.room.id}]);
                }
                this.init = false;
                resolve();
            });
        });
    }

    /**
     * Opens alert to confirm the kicking of the chosen player
     * @param id Id of the player to be kicked
     */
    async kickPlayer(id: string) {
        const alert = await this.alertController.create({
            header: 'Rauswerfen',
            message: 'Möchtest du diesen Spieler wirklich rauswerfen?',
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Nein',
                    role: 'Cancel',
                },
                {
                    cssClass: 'dark',
                    text: 'Ja',
                    handler: () => {
                       this.leaveRoom(id);
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Kicks user from game lobby
     * @param id ID of user to be kicked
     * @param kicked Indicates if player was kicked or not
     */
    leaveRoom(id: string, kicked: boolean = true) {
        this.roomservice.deletePlayer(this.room.id, id);
        this.kicked = kicked;
        const newPlayers: User[] = [];
        for (const player of this.room.players) {
            if (player.id !== id) {
                newPlayers.push(player);
            }
        }
        this.room.players = newPlayers;
        if (this.room.creator.id === id) {
            this.room.creator = this.room.players.length === 0 ? null : this.room.players[0];
        }
        this.roomservice.update(this.room);
    }

    /**
     * Opens modal window to get confirm from player leaving the room
     */
    async openExit() {
        const modal = await this.modalController.create({
            component: GameClosingPage,
            showBackdrop: true
        });
        modal.onDidDismiss().then((data) => {
            if (data.data) {
                this.leaveRoom(this.user.id, false);
            }
        });
        await modal.present();
    }

    /**
     * Creates input for choosing the role of a player
     */
    createInputs() {
        const inputs = [];
        for (let i = 0; i < this.room.players.length; i++) {
            inputs.push(
                {
                    name: 'player' + i,
                    type: 'radio',
                    label: this.room.players[i].username,
                    value: i
                }
            );
        }
        return inputs;
    }

    /**
     * Async function to setup an easy confirm-alert with inserted text
     */
    async presentAlert() {
        const alert = await this.alertController.create({
            cssClass: 'dark',
            header: 'Spielstart alleine nicht möglich',
            message: 'Lade noch ein paar Freunde ein ehe du das Spiel startest!',
            buttons: ['Ok']
        });
        await alert.present();
    }

    /**
     * Gets confirm to start game even when the chosen amount of players has not been reached
     */
    async presentConfirm() {
        const alert = await this.alertController.create({
            header: 'Max. Spieleranzahl nicht erreicht',
            message: 'Willst du das Spiel dennoch starten?',
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Nein',
                    role: 'Cancel',
                },
                {
                    cssClass: 'dark',
                    text: 'Ja',
                    handler: () => {
                        this.presentAlertRadio();
                    }
                }
            ]
        });
        await alert.present();
    }


    /**
     * Presents selection-alert to choose the role of a player
     */
    async presentAlertRadio() {
        const myInputs = this.createInputs();
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Rollenauswahl',
            message: 'Wähle einen Spieler aus, der <b>Mr.X</b> ist! Alle anderen sind die Detektive',
            inputs: myInputs,
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    cssClass: 'dark',
                    text: 'Ok',
                    handler: (data) => {
                        this.distributeRoles(data);
                        this.room.started = true;
                        this.roomservice.update(this.room);
                        console.log(this.distributeRoles(data));
                        this.router.navigate(['player-info', {roomID: this.room.id, userID: this.user.id}]);

                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Gives all users of a room their chosen role
     * @param index Index of player who plays as 'Mr. X'
     */
    distributeRoles(index: string) {
        const indexN: number = +index;
        for (let i = 0; i < this.room.players.length; i++) {
            if (i === indexN) {
                this.room.players[i].role = 'Mr.X';
                this.roomservice.updatePlayer(this.room.id, this.room.players[i]);
            } else {
                this.room.players[i].role = 'Detektiv';
                this.roomservice.updatePlayer(this.room.id, this.room.players[i]);
            }
        }
        this.roomservice.update(this.room);
    }

    /**
     * Checks if logged-in player is persisted in room-document
     */
    loggedInPlayerLeftRoom(): boolean {
        for (const player of this.room.players) {
            if (player.id === this.user.id) {
                return false;
            }
        }
        return true;
    }

    /**
     * Opens alert-window to display further information regarding the start of the game
     */
    startGame() {
        if (this.room.players.length <= 1) {
            this.presentAlert();
        } else if (this.room.players.length < this.maxMember) {
            this.presentConfirm();
        } else {
            this.presentAlertRadio();
        }
    }

    /**
     * Navigates the players to game-select page
     */
    navigateBackHome(): void {
        if (this.kicked) {
            this.showAlert('Du wurdest gekickt!', 'Der Ersteller des Raums hat dich aus dem Raum entfernt.');
        }
        this.router.navigate(['home']);
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
                    cssClass: 'dark',
                    text: 'Close',
                    role: 'cancel',
                }]
        });
        await alert.present();
    }

    /**
     * Opens alert-window that opens role-selection-alert
     * @param header Header of the alert window
     * @param message Message of the alert window
     */
    async showOptionAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Nein',
                    role: 'cancel',
                }, {
                    cssClass: 'dark',
                    text: 'Ja',
                    handler: () => {
                        this.presentAlertRadio();
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Unsubscribes from user and room document;
     * Deletes the room-document, if no player is left
     */
    ionViewWillLeave(): void {
        if (this.room.players.length === 0) {
            this.roomservice.delete(this.room);
        }
        this.roomSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
        clearInterval(this.interval);
    }
}
