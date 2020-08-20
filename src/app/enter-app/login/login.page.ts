import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    /**
     * constructor of component
     * @param auth implements AuthService in component, to login user
     * @param router implements router in component, to navigate to pages
     * @param formBuilder is necessary to check the input validation of the inserted html
     */
    constructor(private auth: AuthService, private router: Router, private formBuilder: FormBuilder) {}

    /**
     * validationsForm creates a new instance of FormGroup
     */
    validationsForm: FormGroup;
    /**
     * saves errorMessage as a string to output it in html
     */
    errorMessage: string;

    /**
     * ValidationMessages get inserted html depending on which case (required, pattern or minlength) is affected
     */
    validationMessages = {
        email: [
            {type: 'required', message: 'Email ist erforderlich.'},
            {type: 'pattern', message: 'Bitte gebe eine gültige Email ein.'}
        ],
        password: [
            {type: 'required', message: 'Passwort ist erforderlich.'},
            {type: 'minlength', message: 'Passwort muss min. 6 Zeichen lang sein.'}
        ]
    };

    /**
     * Registers validators on input-fields
     */
    ngOnInit() {
        this.validationsForm = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ])),
        });
    }

   /**
    * Signs in a user
    * @param email Email of the user to be logged-in
    * @param password Password of the user to be logged-in
    */
    public login(email, password) {
        this.auth.login(email.value, password.value)
            .then(() => {
                this.router.navigate(['home']);
                this.validationsForm.reset();
            }).catch(() => {
            this.errorMessage = 'Anmeldung nicht erfolgreich. \n E-Mail oder Passwort falsch.';
        });
    }

    /**
     * Navigates back to landing-page
     */
    home() {
        this.router.navigate(['enter-app']);
    }
}
