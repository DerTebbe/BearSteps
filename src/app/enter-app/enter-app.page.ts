import {Component} from '@angular/core';
import {Router} from '@angular/router';

/**
 *  Page that user get to see when they open the app
 *  get navigated with button-clicks to loginpage or registerpage
 */
@Component({
    selector: 'app-enter-app',
    templateUrl: './enter-app.page.html',
    styleUrls: ['./enter-app.page.scss'],
})

export class EnterAppPage {

    /**
     * implements the router
     * @param router basic router to navigate trough routes
     */
    constructor(private router: Router) {}

    /**
     * Navigates to login-page
     */
    login() {
        this.router.navigate(['login']);
    }

    /**
     * Navigates to register-page
     */
    register() {
        this.router.navigate(['register']);
    }

    /**
     * navigates to data-protection
     */
    dataProtection() {
        this.router.navigate(['data-protection']);
    }
}
