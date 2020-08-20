import {Component, OnDestroy} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User} from '../models/User';
import {Room} from '../models/Room';
import {RoomService} from '../services/room.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {GeolocationService} from '../services/geolocation.service';
import {AlertController} from '@ionic/angular';

/**
 * Page to create the game with ranges, slides, names and so on
 */

@Component({
    selector: 'app-game-create',
    templateUrl: './game-create.page.html',
    styleUrls: ['./game-create.page.scss'],
})
export class GameCreatePage implements OnDestroy {
    /**
     * the creator get saved in the variable
     */
    creator: User;

    /**
     * default value of maxAmountPlayers set to 2
     */
    maxAmountPlayers = 2;

    /**
     * default value of maxAmountTime set to 30 minutes
     */
    maxAmountTime = 30;

    /**
     * default value of radius set to 500
     */
    radius = 500;

    /**
     * subscribtion to the user
     */
    subscription: Subscription;

    /**
     * error-Map that puts out all errormsgs to html
     */
    errors: Map<string, string> = new Map<string, string>();

    /**
     * checks if location services are enabled on mobile phone and saves position if it is
     */
    onSuccess;

    /**
     * checks if location services are enabled on mobile phone throws alertMsg when its not
     */
    onError;

    /**
     * on default locationAvtivated variable that gets set on true when service can get location of current user
     */
    locationActivated = false;
    /**
     * checks every 5 sec if location-services are now avaible
     */
    interval;

    /**
     * constructor checks if logged in user has his location-services on and saves all the data in database
     * @param authservice necessary to subscribe to user
     * @param roomservice creates room with set information of gamecreate page
     * @param router navigates to gamelobby page
     * @param locationservice connects to geolocation service to get position of currentUser
     * @param alertController necessary to send alertwindows to user
     */
    constructor(private authservice: AuthService,
                private roomservice: RoomService,
                private router: Router,
                private locationservice: GeolocationService,
                private alertController: AlertController,
    ) {
        this.onSuccess = position => {
            this.creator.longtitude = position.coords.longitude;
            this.creator.latitude = position.coords.latitude;
            this.locationActivated = true;
        };

        this.onError = error => {
            if (error.message === 'Illegal Access') {
                this.showAlert('Zugriff verweigert!', 'Du hast uns den Zugriff auf deinen Standort verweigert. So kannst du nicht spielen! Bitte geh in deinen Geräteeinstellungen unter Standort und erlaube BearSteps den Zugriff auf deinen Standort');
            }
        };

    }

    /**
     * subscribes to logged in user and sets position of the game creator
     */
    ionViewDidEnter() {
        this.subscription = this.authservice.user.subscribe((user: User) => {
            this.creator = user;
            this.locationservice.getPosition(this.onSuccess, this.onError);
        });
    }

    /**
     * clear time of interval
     * unsubscribe to user
     */
    ionViewWillLeave() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    /**
     * Unsubscribes from logged-in user
     */
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Calls roomservice to persist a room in database
     */
    createRoom() {
        if (this.checkErrors()) {
            this.roomservice.persist(this.setRoomFeatures()).then((res) => {
                this.roomservice.addPlayer(res.id, this.creator);
                this.router.navigate(['game-lobby', {roomID: res.id}]);
            });
        }
    }

    /**
     * Reads inputs from user to set room-attributes
     */
    setRoomFeatures(): Room {
        const createdRoom: Room = new Room();
        createdRoom.creator = this.creator;
        createdRoom.maxAmountPlayers = Number(this.maxAmountPlayers);
        createdRoom.maxAmountTime = (Number(this.maxAmountTime) * 60);
        // createdRoom.roomName = this.roomname;
        createdRoom.players = [this.creator];
        createdRoom.game = {
            gameName: 'Finde Mr.X',
            radius: Number(this.radius),
            mrXLostByLeavingPlayingArea: false,
            timePlayed: 0,
            mrXwon: null
        };
        return createdRoom;

    }

    /**
     * Checks if all information where given by the user.
     * Displays error-message if an input was not valid
     */
    checkErrors() {
        let noErrors = true;
        this.errors.clear();
/*        if (!this.roomname) {
            this.errors.set('roomname', 'Bitte gib einen Namen für dein Spiel an!');
            noErrors = false;
        }*/
        if (!this.maxAmountPlayers) {
            this.errors.set('maxAmountPlayers', 'Bitte gib an, wie viele Spieler mitspielen sollen!');
            noErrors = false;
        }
        if (!this.maxAmountTime) {
            this.errors.set('maxAmountTime', 'Bitte gib eine maximale Spieldauer an!');
            noErrors = false;
        }
        if (!this.radius) {
            this.errors.set('radius', 'Bitte gib den Radius des Spielbereichs an!');
            noErrors = false;
        }
        if (!this.locationActivated) {
            this.errors.set('location', 'Bitte aktiviere GPS. So bald du es aktiviert hast und wir deinen Standort haben wird das Spiel automatisch gestartet');
            noErrors = false;
            this.refreshLocation();
        }
        return noErrors;
    }

    /**
     * refrehes location of user and sets locationActivated to true - creates Room afterwords
     */
    refreshLocation() {
        this.onSuccess = position => {
            this.creator.longtitude = position.coords.longitude;
            this.creator.latitude = position.coords.latitude;
            this.locationActivated = true;
            this.createRoom();
        };

        this.onError = error => {
        };
        this.interval = setInterval(() => {
            if (!this.locationActivated) {
                this.locationservice.getPosition(this.onSuccess, this.onError);
            } else {
                clearInterval(this.interval);
            }
        }, 5000);
    }

    /**
     * Opens error-alert-window
     * @param message Error-message
     * @param header Header for alert
     */
    async showAlert(header, message) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    cssClass: 'dark',
                    text: 'Close',
                    role: 'cancel'
                }]
        });
        await alert.present();
    }

    /**
     * Navigates back to game-select-page
     */
    navigateBack() {
        this.router.navigate(['home']);
    }

}
