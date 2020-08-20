import {Component} from '@angular/core';
import {User} from '../../models/User';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

/**
 * Page to show all avatars that are currently inserted in project
 */
@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.page.html',
    styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage {
    /**
     * subscribes to current logged in user
     */
    userSubscription: Subscription;

    /**
     * Subscribes the user on AuthDatabase
     */
    userSubscriptionAuth: Subscription;

    /**
     * userobject that is provided by AuthDatabase - to delete anonymus user
     */
    userAuth: firebase.User;

    /**
     * saves current user as class User
     */
    user: User;

    /**
     * saves picture
     */
    picture;

    /**
     * saves currentUser in variable
     */
    currentUser;

    /**
     * empty stringArray to push all avatars
     * each picture gets shown in html
     */
    picArr: string[] = [];

    /**
     * for-loop checks all 15 pictures and pushs them into array
     * @param authService necessary to subscribe to user
     * @param userService necessary to update user after picture got changed
     * @param router navigates the user after picture got changed
     */
    constructor(private authService: AuthService, private userService: UserService,
                private router: Router) {
        for (let i = 1; i <= 15; i++) {
            this.picArr.push('Nature' + i.toString());
        }

    }

    /**
     * Subscription to user and userAuth
     */
    ionViewWillEnter() {
        this.userSubscriptionAuth = this.authService.checkAuthState().subscribe((user) => {
            if (user) {
                this.userAuth = user;
            }
        });
        this.userSubscription = this.authService.user.subscribe((user: User) => {
            if (user) {
                this.picture = user.picture;
                this.currentUser = user;
            }
        });
    }

    /**
     * unsubscribe when user leaves the page
     */
    ionViewWillLeave() {
        this.userSubscription.unsubscribe();
        this.userSubscriptionAuth.unsubscribe();
    }

    /**
     * inserts selected picture and overwrites the previous picture
     * updates user with 'update'-method and navigates back to home
     * @param avatar gets avatar as string
     */
    changeAvatar(avatar: string) {
        this.currentUser.picture = avatar;
        this.userService.update(this.currentUser).then(() => {
            this.router.navigate(['home']);
        });
    }

}
