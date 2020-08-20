import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

/**
 * Page for registering as a user of the app
 */

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    /**
     * validationsForm creates a new instance of FormGroup
     */
    validationsForm: FormGroup;

    /**
     * saves errorMessage as a string to output it in html
     */
    errorMessage = '';

    /**
     * saves successMessage as a string to output it in html
     */
    successMessage = '';

    /**
     * Error messages for email and password validation
     */
    VALIDATION_MESSAGES = {
        email: [
            {type: 'required', message: 'Email ist erforderlich.'},
            {type: 'pattern', message: 'Bitte gebe eine gültige Email ein.'}
        ],
        password: [
            {type: 'required', message: 'Passwort ist erforderlich.'},
            {type: 'minlength', message: 'Passwort muss min. 6 Zeichen lang sein.'}
        ],
        username: [
            {type: 'required', message: 'Username ist erforderlich'},
            {type: 'minlength', message: 'Username muss min. 4 Zeichen lang sein'}
        ]
    };

    /**
     *
     * @param authservice implements AuthService in component, to login user
     * @param formBuilder is necessary to check the input validation of the inserted html
     * @param router implements router in component, to navigate to pages
     * @param render is a base class to implement custom rendering (necessary to insert slide in animation for welcome-img)
     */
    constructor(private authservice: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                public render: Renderer2
    ) {}

    /**
     * checks the hidden box-element of the welcomeing img
     */
    @ViewChild('box') box: ElementRef;

    /**
     * Registers validators on input-fields
     */
    ngOnInit() {
        this.validationsForm = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            username: new FormControl('', Validators.compose([
                Validators.minLength(4),
                Validators.required,
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ])),
            confirmPW: new FormControl('')
        });
    }

    /**
     * Registers a new user
     * @param email Email of the user to be registered
     * @param username Username of the user to be registered
     * @param password Password of the user to be registered
     */
    register(email, username, password) {
        this.errorMessage = '';
        const confirmPW = ((document.getElementById('confirmPW') as HTMLInputElement)).value;
        if (password.value !== confirmPW) {
            this.errorMessage = 'Passwörter stimmen nicht über ein';
        } else {
            this.authservice.register(email.value, username.value, password.value).then(() => {
                // Animation to slide in Welcome-box
                this.render.removeClass(this.box.nativeElement, 'hidden');
                this.render.addClass(this.box.nativeElement, 'slide-in-left');
                setTimeout(() => {
                    this.authservice.login(email.value, password.value).then(() => {
                        this.router.navigate(['home']);
                        this.validationsForm.reset();
                        this.render.addClass(this.box.nativeElement, 'hidden');
                    });
                }, 500);
            }).catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    this.errorMessage = 'Es existiert bereits ein Account mit dieser Email Adresse';
                } else {
                    this.errorMessage = error.message;
                }
            });
        }
    }

    /**
     * Signs in user anonymously
     */
    anonymusSignIn() {
        this.authservice.anonymusSignIn().then(res => {
            console.log(res);
            this.router.navigate(['username-select']);
        });
    }

    /**
     * Navigates back to landing-page
     */
    home() {
        this.router.navigate(['enter-app']);
    }
}
