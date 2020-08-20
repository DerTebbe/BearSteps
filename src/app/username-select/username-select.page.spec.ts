import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsernameSelectPage } from './username-select.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';


describe('UsernameSelectPage', () => {
  let component: UsernameSelectPage;
  let fixture: ComponentFixture<UsernameSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameSelectPage ],
      imports: [IonicModule ,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([]),
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsernameSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

});
