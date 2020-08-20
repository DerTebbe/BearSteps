import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameEndPage } from './game-end.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {Room} from '../models/Room';

describe('GameEndPage', () => {
  let component: GameEndPage;
  let fixture: ComponentFixture<GameEndPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameEndPage ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GameEndPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * checks if the time format is correct
   */
  it('should show correct time' , () => {

    expect(component.secondsToHms(4350)).toBe('01:12:30');
  });

  /**
   * szenario: Detective win because Mr. X left the playing area
   */
  it('should set winmessage correctly', () => {
    component.role = 'Detective';
    component.room = new Room();
    component.room.game = {
      gameName: 'Testgame',
      radius: 1000,
      mrXLostByLeavingPlayingArea: true,
      timePlayed: 400,
      mrXwon: false,
    };
    component.showWin();
    expect(component.winMessage).toBe('Glückwunsch! Ihr habt gewonnen! Mr. X ist aus dem Spielradius abgehauen.');
  });

  /**
   * szenario: Mr. X looses because the detectives found him
   */
  it('should set defeatmassage correctly', () => {
    component.role = 'Mr.X';
    component.room = new Room();
    component.room.game = {
      gameName: 'Testgame',
      radius: 1000,
      mrXLostByLeavingPlayingArea: false,
      timePlayed: 400,
      mrXwon: false,
    };
    component.showDefeat();
    expect(component.defeatMessage).toBe('Du wurdest von den Detektiven entdeckt und gestoppt.');
  });

});
