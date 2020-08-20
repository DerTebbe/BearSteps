import { Component, OnInit } from '@angular/core';
import {User} from '../models/User';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {Achievement} from '../models/Achievement';
import {Router} from '@angular/router';
import {AchievementService} from '../services/achievement.service';

/**
 * shows of achievements of the current user
 */
@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.page.html',
  styleUrls: ['./achievement.page.scss'],
})
export class AchievementPage implements OnInit {
  /**
   * subscription to the logged in user
   */
  userSubscription: Subscription;
  /**
   * currently logged in user
   */
  currUser: User;
  /**
   * all achievements of the currently logged in user. Used in html
   */
  achievements: Achievement[];
  /**
   * rank of the current user, empty placeholder. HTML display
   */
  rank = '';
  /**
   * achievementpoints of the current user, 0 as placeholder. HTML display
   */
  achpoints = 0;
  /**
   * shows to html if current user has achievements saved
   */
  displayAch = false;

  /**
   * all important dependencies
   * @param authService Authentification Service
   * @param userService User Service
   * @param router  Router
   * @param achievementService Achievement Service
   */
  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private achievementService: AchievementService) {
  }

  /**
   * initializes empty achievements arry
   */
  ngOnInit() {
    this.achievements = [];
  }

  /**
   * subscribes to the current user when the page is entered
   */
  ionViewWillEnter() {
    this.subscribeToUser();
  }

  ionViewWillLeave() {
    this.userSubscription.unsubscribe();
  }

  /**
   * Subscribes to the logged-in user
   */
  subscribeToUser(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.userSubscription = this.authService.user.subscribe((user: User) => {
        this.currUser = user;
        this.achievements = this.sortAchievementsByPointsDesc(user.achievements);
        this.displayAch = (user.achievements.length !== 0);
        this.achpoints = user.achievements.reduce((acc, ach) => acc + ach.points, 0);
        this.getRank(user);

        resolve();
      });
    });
  }

  /**
   * sorts all achievement in descending order
   * @param achs all achievements array
   */
  sortAchievementsByPointsDesc(achs: Achievement[]): Achievement[] {
    achs.sort((ach1, ach2) => {
      if (ach1.points > ach2.points) {
        return -1;
      }
      if (ach1.points < ach2.points) {
        return 1;
      }
      return 0;
    });
    return achs;
  }

  /**
   * gets the new rank of the user and updates it
   * @param user current user
   */
  getRank(user: User) {
    this.rank = this.achievementService.updateRank(user);
    user.rank = this.rank;
    this.userService.update(user);
  }

  /**
   * navigate to home
   */
  home() {
    this.router.navigate(['home']);
  }
}
