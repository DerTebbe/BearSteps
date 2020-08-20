import {ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnterAppPage } from './enter-app.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('EnterAppPage', () => {
  let component: EnterAppPage;
  let fixture: ComponentFixture<EnterAppPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ EnterAppPage ],
      imports: [IonicModule ,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
