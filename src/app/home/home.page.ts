import {Component} from '@angular/core';
import {RoomService} from '../services/room.service';
import {Room} from '../models/Room';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {User} from '../models/User';
import {Subscription} from 'rxjs';
import {UserService} from '../services/user.service';
import {Achievement} from '../models/Achievement';
import {AchievementService} from '../services/achievement.service';
import {animate, group, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
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

export class HomePage {

    /**
     *  saves a room - so user can join a room with the roomCode
     */
    rooms: Room[] = [];
    /**
     * saves an Array of Achievements
     */
    achievements: Achievement[] = [];

    /**
     * Subscribes the user on FireStoreUser
     */
    userSubscription: Subscription;

    /**
     * Subscribes the user on AuthDatabase
     */
    userSubscriptionAuth: Subscription;

    /**
     * saves the user
     */
    user: User;

    /**
     * userobject that is provided by AuthDatabase - to delete anonymus user
     */
    userAuth: firebase.User;

    /**
     * saves the email of an user to show it in html
     */
    mail = '';

    /**
     * saves the username to show it in html
     */
    username = '';

    /**
     * saves the rank of an user to show it in html
     */
    rank = '';

    /**
     * saves welcome-msg into the string to interpolate it into html
     */
    welcomeMessage = '';

    /**
     * saves the picture of an user to show it in html
     */
    picture;

    /**
     * saves the achievementmsgs
     */
    achMessage = '';


    /**
     * default value of achievementpoints until they get overwritten
     */
    achievPoints = 0;

    /**
     * default value of statistic (gamesWon) until they get overwritten
     */
    gamesWon = 0;

    /**
     * default on false - switches to true when achievement is earned
     */
    displayAchievement = false;



    constructor(private router: Router,
                public alertController: AlertController,
                public authService: AuthService,
                private roomservice: RoomService,
                private achievementService: AchievementService,
                private userService: UserService
    ) {
    }

    /**
     * Important to have the subscription in 'ionViewWillEnter' to update avatar after it changed
     */
    ionViewWillEnter() {
        this.userSubscriptionAuth = this.authService.checkAuthState().subscribe((user) => {
            if (user) {
                this.userAuth = user;
            }
        });
        this.userSubscription = this.authService.user.subscribe((user: User) => {
            if (user) {
                this.user = user;
                this.mail = user.email;
                this.username = user.username;
                this.picture = user.picture;
                this.rank = user.rank;
                if (user.achievements) {
                    this.achievPoints = user.achievements.reduce((acc, ach) => acc + ach.points, 0);
                }
                if (user.statistic) {
                    this.gamesWon = user.statistic.gamesWon;
                }
            }
        });
        this.welcomeMessage = this.welcomeMsg();
    }


    /**
     * checks for achievements
     */
    ionViewDidEnter() {
        // checks for achievements
        this.checkAchievements();
    }

    /**
     * unsubscribe user to leave safley
     */
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
        this.userSubscriptionAuth.unsubscribe();
    }

    /**
     * navigation to game-select
     */
    createGame() {
        this.router.navigate(['game-select']);
    }

    /**
     * navigation to avatar change
     */
    changeAvatar() {
        this.router.navigate(['avatar']);
    }

    /**
     * navigation to statistics page
     */
    goStats() {
        this.router.navigate(['statistics']);
    }

    /**
     * naviagtion to achievements
     */
    navigateAchievments() {
        this.router.navigate(['achievement']);
    }

    /**
     * shows an alert with an input field
     * if user types in the invite code, the app tries to find the room with the corresponding code
     * if everything worked, app navigates to the game-lobby
     */
    async joinGame() {
        const alert = await this.alertController.create({
            header: 'Spiel beitreten',
            message: 'Gib den Einladungscode der Spiellobby an: ',
            inputs: [
                {
                    name: 'code',
                    placeholder: 'Code'
                }
            ],
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'dark'
                },
                {
                    text: 'Beitreten',
                    cssClass: 'dark',
                    handler: data => {
                        const code = data.code;
                        this.roomservice.findRoomByRoomNumber(code).then((room: Room) => {
                            this.router.navigate(['game-lobby', {roomID: room.id}]);
                        }).catch(() => {
                            this.showAlert('Das hat nicht geklappt...', 'Diesen Raum scheint es nicht zu geben.');
                        });
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * opens alertwindow, that the user can cancel
     * @param header implements a string, that is set in 'this.showAlert' includes the header-message of the alert
     * @param message includes the text-message of the alert
     */
    async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel'
                }]
        });
        await alert.present();
    }

    /**
     * gets date and hours of today and greets the user depending on time of the day
     */
    welcomeMsg() {
        const myDate = new Date();
        const hrs = myDate.getHours();
        let msg;

        if (hrs >= 6 && hrs < 12) {
            msg = ['So früh schon wach, ', 'Guten Morgen, ', 'Auch schon hier, '];
        } else if (hrs >= 12 && hrs <= 17) {
            msg = ['Guten Mittag, ', 'Let\'s Go, '];
        } else if (hrs >= 17 && hrs <= 24) {
            msg = ['Abendliches Abenteuer gefällig, ', 'Guten Abend, ', 'Abendliche Partie, '];
        } else if (hrs <= 6) {
            msg = ['So spät noch wach, ', 'Du auch noch hier, ', 'Schlafenszeit, '];
        }
        return msg[Math.floor(Math.random() * msg.length)];
    }

    /**
     * AlertPopup for logout - easy cancel or submit button to control if user really wants to logout
     * if user submit logout the method 'this.signOut()' gets triggered
     */
    async presentConfirm() {
        const alert = await this.alertController.create({
            cssClass: 'alertPop',
            header: 'Logout',
            message: 'Möchtest du dich wirklich ausloggen?',
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
                        this.signOut();
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * function triggers authService/firebsae function to logout user
     * when user logouts he gets directed to enter-app-page
     */
    signOut() {
        if (this.userAuth.isAnonymous) {
            this.userService.delete(this.userAuth.uid);
            this.authService.SignOut().then(() => {
                this.userAuth.delete();
                this.router.navigate(['enter-app']);
            });
        } else {
            this.authService.SignOut().then(() => {
                this.router.navigate(['enter-app']);
            });
        }
    }

    /**
     * checks for new achievements
     * updates them in the database
     */
    checkAchievements() {

        this.achievements = this.achievementService.checkAchievements(this.user);

        // checks if user got new achievements
        if (this.achievements.length !== 0) {
            const timer = this.achievements.length * 5000;
            this.achMessage = (this.achievements.length === 1) ? 'Du hast ein neues Achievement errungen.' : `Du hast ${this.achievements.length} neue Achievements errungen!`;
            this.user.rank = this.achievementService.updateRank(this.user);

            // show Animation for 5 seconds times amount of new achievement
            this.displayAchievement = true;
            setTimeout(() => {
                this.displayAchievement = false;
            }, timer);

            // updates user
            this.user.achievements = this.user.achievements.concat(this.achievements);
            this.userService.update(this.user);

            this.achievPoints = this.user.achievements.reduce((acc, ach) => acc + ach.points, 0);

        }

    }
}
