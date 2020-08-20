import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {User} from '../models/User';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-username-select',
    templateUrl: './username-select.page.html',
    styleUrls: ['./username-select.page.scss'],
})
export class UsernameSelectPage implements OnInit, OnDestroy {

    /**
     * saves the userId as string
     */
    userID: string;
    /**
     * saves the UserArray in variable
     */
    user: User = new User();

    /**
     * subscribe on User to set new User
     */
    subscribeUser: Subscription;
    /**
     * saves errorMessage to show in html
     */
    errorMessage = '';

    /**
     * implements necessary services
     * @param authservice implements AuthService in component, to login user
     * @param userservice calls the function 'persistAnonymus' to create an anonymus user
     * @param router implements router in component, to navigate to pages
     */
    constructor(private authservice: AuthService, private userservice: UserService, private router: Router) {}

    /**
     * Submits a new anonymous user
     */
    submit() {
        this.errorMessage = '';
        if (this.user.username.length < 4) {
            this.errorMessage = 'Username muss min. 4 Zeichen lang sein';
        } else {
            this.userservice.persistAnonymus(this.user);
            this.router.navigate(['home']);
        }
    }

    /**
     * Subscribe to logged-in user
     */
    ngOnInit() {
        this.subscribeUser = this.authservice.checkAuthState().subscribe((action) => {
            if (action) {
                this.userID = action.uid;
                this.user.id = this.userID;
            }
        });
    }

    /**
     * Unsubscribes from logged-in user
     */
    ngOnDestroy() {
        this.subscribeUser.unsubscribe();
    }
}
