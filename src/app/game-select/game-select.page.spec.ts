import {ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GameSelectPage } from './game-select.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('GameSelectPage', () => {
  let component: GameSelectPage;
  let fixture: ComponentFixture<GameSelectPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ GameSelectPage ],
      imports: [IonicModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
