import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RegisterPage} from './register.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

describe('RegisterPage', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [RegisterPage],
            imports: [IonicModule ,
                AngularFireModule.initializeApp(environment.firebaseConfig),
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule.withRoutes([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });

});
