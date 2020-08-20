import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {RoomService} from '../services/room.service';
import {Room} from '../models/Room';
import {User} from '../models/User';
import {AuthService} from '../services/auth.service';

/**
 * Component that creates the instance between game-lobby and play-page
 * it shows the role and description of the roles
 * mrx gets an instant start-button to get ahead
 * detectives get a 3min timer so they cant catch up instantly
 */
@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.page.html',
    styleUrls: ['./player-info.page.scss'],
})
export class PlayerInfoPage {

    /**
     * checks what role the user has
     */
    public role;

    /**
     * saves roomId, that is send by page before
     */
    roomID: any;

    /**
     * subscribes to room
     */
    roomSubscription: Subscription;

    /**
     * subscribes to current loggedin user
     */
    userSubscription: Subscription;

    /**
     * saves the user as Class User
     */
    user: User;

    /**
     * saves new Room
     */
    room: Room = new Room();

    /**
     * saves id of current user
     */
    private id;

    /**
     * enables button in html for detectives
     */
    buttonEnabled: any;

    /**
     *
     * @param route sends parameters of previous page to this page
     * @param roomService inserts RoomService into page to subscribe on room and use roomservice functions
     * @param router is necessary to navigate trough pages
     * @param render is necessary to trigger attributes or class animations in typescript
     * @param authService inserts authService into page to use methods
     */
    constructor(private route: ActivatedRoute,
                private roomService: RoomService,
                private router: Router,
                public render: Renderer2,
                private authService: AuthService
    ) {
    }

    /**
     * detects the element 'mrx' in html which refers to the mrx-page (necessary to remove ion-page-hidden)
     */
    @ViewChild('mrx') mrx: ElementRef;

    /**
     * detects the element 'detective' in html which refers to the detective-page (necessary to remove ion-page-hidden)
     */
    @ViewChild('detective') detective: ElementRef;

    /**
     * detects element 'timer3' to set right setTimeOut for the GameStartTimer
     */
    @ViewChild('timer3') timer3: ElementRef;

    /**
     * detects element 'timer2' to set right setTimeOut for the GameStartTimer
     */
    @ViewChild('timer2') timer2: ElementRef;

    /**
     * detects element 'timer' to set right setTimeOut for the GameStartTimer
     */
    @ViewChild('timer') timer: ElementRef;

    /**
     * detects element 'go' to set right setTimeOut for the GameStartTimer
     */
    @ViewChild('go') go: ElementRef;


    /**
     * subscribes to room when user enters page
     */
    async ionViewWillEnter() {
        try {
            await this.initUser();
            const roomID: string = this.route.snapshot.paramMap.get('roomID');
            this.subscribeToRoom(roomID);
        } catch (e) {
            console.error('Irgendwas lief schief in der Player-Info-Page');
        }
    }

    /**
     * unsubscribes on each subscription
     */
    ionViewWillLeave() {
        if (this.roomSubscription) {
            this.roomSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    /**
     * subscribes to user this function gets called in ionViewWillEnter
     */
    initUser(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.userSubscription = this.authService.user.subscribe((user: User) => {
                if (user) {
                    this.id = user.id;
                }
                resolve();
            });
        });
    }

    /**
     * Passing the room-Data to PlayerInfo-Page to get difference between roles
     * @param roomID getting the roomID to have access to players and their roles
     * includes a setTimeout-chain to set the perfect gametimer
     */
    subscribeToRoom(roomID: string): Promise<void> {
        return new Promise<void>(() => {
            this.roomSubscription = this.roomService.find(roomID).subscribe((action) => {
                this.room = action.payload.data();
                this.room.id = action.payload.id;
                for (const player of this.room.players) {
                    if (player.id === this.id) {
                        this.role = player.role;
                    }
                }
                if (this.role === 'Detektiv') {
                    this.render.removeClass(this.detective.nativeElement, 'ion-page-hidden');
                    if (this.room.catchword) {
                        setTimeout(() => {
                            this.render.removeClass(this.timer3.nativeElement, 'hidden');
                        }, 176999);
                        setTimeout(() => {
                            this.render.addClass(this.timer3.nativeElement, 'hidden');
                            this.render.removeClass(this.timer2.nativeElement, 'hidden');
                        }, 177999);
                        setTimeout(() => {
                            this.render.addClass(this.timer2.nativeElement, 'hidden');
                            this.render.removeClass(this.timer.nativeElement, 'hidden');
                        }, 178999);
                        setTimeout(() => {
                            this.render.addClass(this.timer.nativeElement, 'hidden');
                            this.render.removeClass(this.go.nativeElement, 'hidden');
                        }, 179599);
                        setTimeout(() => {
                            this.buttonEnabled = document.getElementById('btnTime');
                            this.buttonEnabled.removeAttribute('disabled');
                            this.play();
                        }, 179999);
                    }
                } else if (this.role === 'Mr.X') {
                    this.render.removeClass(this.mrx.nativeElement, 'ion-page-hidden');
                }
            });
        });
    }

    /**
     * navigate to play-page and sends the room-id to next page
     */
    play() {
        this.router.navigate(['play', {roomID: this.room.id}]);
    }

}
