import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GameCreatePage } from './game-create.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {User} from '../models/User';
import {Room} from '../models/Room';

describe('GameCreatePage', () => {
  let component: GameCreatePage;
  let fixture: ComponentFixture<GameCreatePage>;

  beforeEach(((done) => {
    TestBed.configureTestingModule({
      declarations: [ GameCreatePage ],
      imports: [
        IonicModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([]),
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  }));

  it('should show correct errormessage', () => {
    component.maxAmountTime = undefined;
    component.maxAmountPlayers = 4;
    component.checkErrors();
    expect(component.errors.get('maxAmountTime')).toBe('Bitte gib eine maximale Spieldauer an!');
  });

});
