import { TestBed } from '@angular/core/testing';

import { AchievementService } from './achievement.service';
import {User} from '../models/User';
import {Achievement} from '../models/Achievement';

describe('AchievementService', () => {
  let service: AchievementService;

  // initiating test data

  const testUser: User = new User();
  testUser.achievements = [
    new Achievement('Erster Sieg!', 'Du hast dein erstes Spiel gewonnen! Wunderbar!',
        AchievementService.getShortDate(), 20, 'FirstWin'),
    new Achievement('Taschendieb!', 'Dein erster erfolgreicher Raubzug als Mr. X.',
        AchievementService.getShortDate(), 10, 'FirstWinMrX')
  ];
  testUser.statistic = {
    gamesPlayed: 5,
    gamesPlayedAsMrX: 2,
    gamesWon: 1,
    gamesWonAsMrX: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * it should find the right achievements for the testuser
   * he won one new game as detective
   */
  it('should create the right achievement', () => {
    testUser.statistic.gamesWon = 2;

    expect(service.checkAchievements(testUser)[0].title).toBe('Anfänger!');
  });

  /**
   * it should find the correct rank for the testuser who has two achievements
   */
  it('should find correct rank of the user', () => {
    expect(service.updateRank(testUser)).toBe('Bronze-Anfänger');
  });
});
