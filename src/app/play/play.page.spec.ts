import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PlayPage} from './play.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('PlayPage', () => {
    let component: PlayPage;
    let fixture: ComponentFixture<PlayPage>;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [PlayPage],
            imports: [IonicModule.forRoot(),
                AngularFireModule.initializeApp(environment.firebaseConfig),
                RouterTestingModule.withRoutes([])
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(PlayPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });

});
