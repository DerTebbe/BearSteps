import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AchievementPage } from './achievement.page';
import {Achievement} from '../models/Achievement';
import {User} from '../models/User';
import {Room} from '../models/Room';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

describe('AchievementPage', () => {
  let component: AchievementPage;
  let fixture: ComponentFixture<AchievementPage>;

  const achievements: Achievement[] = [
    new Achievement('Erster Sieg!', 'Du hast dein erstes Spiel gewonnen! Wunderbar!',
        'now', 20, 'FirstWin'),
    new Achievement('Schneller Lerner!', 'Die ersten fünf Siege. Bleib dran!',
        'now', 25, 'FiveWins'),
    new Achievement('Erfahrener Spieler!', '10 gewonnene Spiele! Super!',
        'now', 50, 'TenWins')
  ];

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ AchievementPage ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

  /**
   * checks if Testarray is sorted in the right order when the method "sortAchievementsbyPointsDesc" is called
   */
  it('should sort achievements' , () => {
    const achs = achievements;
    component.sortAchievementsByPointsDesc(achs);
    expect(achs[0].title).toBe('Erfahrener Spieler!');
  });


});
