import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AvatarPage} from './avatar.page';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';


describe('AvatarPage', () => {
    let component: AvatarPage;
    let fixture: ComponentFixture<AvatarPage>;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [AvatarPage],
            imports: [
                IonicModule,
                AngularFireModule.initializeApp(environment.firebaseConfig),
                RouterTestingModule.withRoutes([]),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });

});
