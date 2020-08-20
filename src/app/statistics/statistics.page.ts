import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {User} from '../models/User';
import {IStatistic} from '../models/IStatistic';

/**
 * Page to display statistics of a user
 */
@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.page.html',
    styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage {

    /**
     * Subscription of logged in user
     */
    sub: Subscription;

    /**
     * Logged in user
     */
    user: User;

    /**
     * Indicates if user has been loaded
     */
    userLoaded = false;

    /**
     * Current date
     */
    date = new Date().toLocaleDateString();

    /**
     * Statistics of logged in user
     */
    userStats: IStatistic;

    /**
     * Declares all data needed for the pie chart
     */
    statsWonAndLost: {title, type, data, options, width, height};

    /**
     * Indicates if chart has been loaded
     */
    loadedStatsWonAndLost = false;

    /**
     * Indicates if stats are loaded
     */
    statisticsAvailable = true;

    /**
     * Subscribes to user to get his statistics
     * @param authservice
     * @param router
     */
    constructor(private authservice: AuthService, private router: Router) {
        this.sub = this.authservice.user.subscribe((user: User) => {
            this.user = user;
            this.userLoaded = true;
            if (this.statisticsAreAvailable(this.user.statistic)) {
                this.userStats = user.statistic;
                this.prepareWonAndLostData();
            }else {
                this.statisticsAvailable = false;
            }
        });
    }

    /**
     * Indicated if user has stats
     * @param statistic Possible statistics of user
     */
    statisticsAreAvailable(statistic: IStatistic) {
        return !(statistic.gamesWon === 0 && statistic.gamesPlayed === 0 && statistic.gamesPlayedAsMrX === 0 && statistic.gamesWonAsMrX === 0);
    }

    /**
     * Creates pie chart with won and lost games of user
     */
    prepareWonAndLostData() {
        const wonGames = this.userStats.gamesWon;
        const lostGames = this.userStats.gamesPlayed - wonGames;
        this.statsWonAndLost = {
            title: 'Spiele gewonnen und verloren',
            type: 'PieChart',
            data: [
                ['Spiele gewonnen', wonGames],
                ['Spiele verloren', lostGames],
            ],
            options: {
                backgroundColor: {fill: 'transparent'},
                is3D: true,
                slices: [{color: '#253031'}, {color: '#FFB35C'}],
                fontName: 'Dosis',
                fontSize: 13,
            },

            width: 400,
            height: 250
        };
        this.loadedStatsWonAndLost = true;
    }

    /**
     * Navigates to game-select-page
     */
    navigateToGames() {
        this.router.navigate(['game-select']);
    }

    /**
     * Unsubscribes from user
     */
    ionViewWillLeave(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
