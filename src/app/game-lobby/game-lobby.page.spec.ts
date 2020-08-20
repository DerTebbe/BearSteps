import {ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameLobbyPage } from './game-lobby.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

describe('GameLobbyPage', () => {
  let component: GameLobbyPage;
  let fixture: ComponentFixture<GameLobbyPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ GameLobbyPage ],
      imports: [IonicModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({roomID: 'AuuLruiEhOTxJ1nHAZ7t'})
          }
        }
      }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameLobbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
