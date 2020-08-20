import {Injectable} from '@angular/core';
import {Achievement} from '../models/Achievement';
import {UserService} from './user.service';
import {User} from '../models/User';
/**
 * Service manages all achievements and ranks that can be earned
 */
@Injectable({
    providedIn: 'root'
})

export class AchievementService {

    /**
     * all Ranks, saved by the achievementpoints needed to earn them
     */
    allRanks: Map<number, string> = new Map([
        [25, 'Bronze-Anfänger'],
        [50, 'Bronze-Top-Anfänger'],
        [75, 'Bronze-Top-Master-Anfänger'],
        [100, 'Silber-Lehrling'],
        [150, 'Silber-Elite-Lehrling'],
        [200, 'Silber-Elite-Master-Lehrling'],
        [300, 'Gold-All-Star'],
        [400, 'Gold-Nova-All-Star'],
        [500, 'Gold-Nova-Master-All-Star'],
        [600, 'Platin-Experte'],
        [700, 'Platin-Guardian-Experte'],
        [800, 'Diamond-Master'],
        [900, 'Diamond-Guardian-Master'],
        [1000, 'Challenger-Champion'],
        [1100, 'Supreme-Challenger-Champion'],
        [1155, 'Großartige-Prestige-Legende'],
    ]);

    /**
     * all Achievements that are earned by wins
     */
    winAchievements: Map<number, Achievement> = new Map([
        [1, new Achievement('Erster Sieg!', 'Du hast dein erstes Spiel gewonnen! Wunderbar!',
            AchievementService.getShortDate(), 20, 'FirstWin')],
        [5, new Achievement('Schneller Lerner!', 'Die ersten fünf Siege. Bleib dran!',
            AchievementService.getShortDate(), 25, 'FiveWins')],
        [10, new Achievement('Erfahrener Spieler!', '10 gewonnene Spiele! Super!',
            AchievementService.getShortDate(), 50, 'TenWins')],
        [25, new Achievement('Expertenspieler!', 'Schon 25 gewonnene Spiele!',
            AchievementService.getShortDate(), 100, 'TwentyFiveWins')],
        [50, new Achievement('Wahrer Master!', 'Du hast 50 Spiele gewonnen! Ein wahrer Meister!',
            AchievementService.getShortDate(), 200, 'FiftyWins')]
    ]);

    /**
     * all Wins that are earned by wins as Mr X.
     */
    winMrXAchievements: Map<number, Achievement> = new Map([
        [1, new Achievement('Taschendieb!', 'Dein erster erfolgreicher Raubzug als Mr. X.',
            AchievementService.getShortDate(), 10, 'FirstWinMrX')],
        [5, new Achievement('Straßenräuber!', 'Fünf Diebstähle als Mr. X. Du machst die Straßen unsicher!',
            AchievementService.getShortDate(), 25, 'FiveWinsMrX')],
        [10, new Achievement('Bandit!', 'Jeder sollte sich vor dir in Acht nehmen. 10 gewonnene Coups sind ansehbar!',
            AchievementService.getShortDate(), 50, 'TenWinsMrX')],
        [25, new Achievement('Schatten!', 'Ein richtiger Experte. Schon 25 erfolgreiche Überfälle!',
            AchievementService.getShortDate(), 100, 'TwentyFiveWinsMrX')],
        [50, new Achievement('Meisterdieb!', 'Du hast den Höhepunkt deiner kriminellen Laufbahn erreicht!',
            AchievementService.getShortDate(), 200, 'FiftyWinsMrX')]
    ]);

    /**
     * all Achievements that are earned by Detective Wins
     */
    winDetectiveAchievements: Map<number, Achievement> = new Map([
        [1, new Achievement('Anfänger!', 'Du hast deinen ersten Fall aufgeklärt und Mr. X geschnappt. Ein super Start!',
            AchievementService.getShortDate(), 10, 'FirstWinDetektiv')],
        [5, new Achievement('Spürnase!', 'Deine Detektivkarriere nimmt Fahrt auf. Fünf abgeschlossene Fälle!',
            AchievementService.getShortDate(), 25, 'FiveWinsDetektiv')],
        [10, new Achievement('Kommissar!', 'Du hast 10 Verbrecher eingebuchtet! Bleib dran!',
            AchievementService.getShortDate(), 50, 'TenWinsDetektiv')],
        [25, new Achievement('Agent!', 'Du wirst ein Alptraum der Verbrecherwelt. 25 Fälle hast du erfolgreich abgeschlossen.',
            AchievementService.getShortDate(), 100, 'TwentyFiveWinsDetektiv')],
        [50, new Achievement('Meisterdetektiv!', 'Du hast 50 Ermittlungen aufgeklärt. Ein Vorbild für jeden anderen Detektiv!',
            AchievementService.getShortDate(), 200, 'FiftyWinsDetektiv')]
    ]);

    /**
     * @ignore
     */
    constructor() {
    }

    /**
     * creates a readable Date
     */
    public static getShortDate(): string {
        const nowDate: Date = new Date();
        return nowDate.getDate() + '.' + (nowDate.getMonth() + 1) + '.' + nowDate.getFullYear();
    }

    /**
     * checks if new achievements are earned
     * based on statistics saved in the user profile
     * @param user current user
     * returns array of all new earned achievements, if there are none, array is empty
     */
    checkAchievements(user: User): Achievement[] {
        const oldAchiev: Achievement[] = (user.achievements) ? user.achievements : [];
        const newAchiev: Achievement[] = [];

        if (user.statistic) {

            // checks for GamesWon
            const gW = user.statistic.gamesWon;
            switch (gW) {
                case 50:
                    if (!oldAchiev.find(ach => ach.title === 'Wahrer Master!')) {
                        newAchiev.push(this.winAchievements.get(50));
                    }
                    break;
                case 25:
                    if (!oldAchiev.find(ach => ach.title === 'Expertenspieler!')) {
                        newAchiev.push(this.winAchievements.get(25));
                    }
                    break;
                case 10:
                    if (!oldAchiev.find(ach => ach.title === 'Erfahrener Spieler!')) {
                        newAchiev.push(this.winAchievements.get(10));
                    }
                    break;
                case 5:
                    if (!oldAchiev.find(ach => ach.title === 'Schneller Lerner!')) {
                        newAchiev.push(this.winAchievements.get(5));
                    }
                    break;
                case 1:
                    if (!oldAchiev.find(ach => ach.title === 'Erster Sieg!')) {
                        newAchiev.push(this.winAchievements.get(1));
                    }
                    break;
                default:
                    break;
            }

            // check Achievements for Mr. X Wins
            const gWX = user.statistic.gamesWonAsMrX;
            switch (gWX) {
                case 50:
                    if (!oldAchiev.find(ach => ach.title === 'Meisterdieb!')) {
                        newAchiev.push(this.winMrXAchievements.get(50));
                    }
                    break;
                case 25:
                    if (!oldAchiev.find(ach => ach.title === 'Schatten!')) {
                        newAchiev.push(this.winMrXAchievements.get(25));
                    }
                    break;
                case 10:
                    if (!oldAchiev.find(ach => ach.title === 'Bandit!')) {
                        newAchiev.push(this.winMrXAchievements.get(10));
                    }
                    break;
                case 5:
                    if (!oldAchiev.find(ach => ach.title === 'Straßenräuber!')) {
                        newAchiev.push(this.winMrXAchievements.get(5));
                    }
                    break;
                case 1:
                    if (!oldAchiev.find(ach => ach.title === 'Taschendieb!')) {
                        newAchiev.push(this.winMrXAchievements.get(1));
                    }
                    break;
                default:
                    break;
            }

            // check for Detective Wins
            const gWD = user.statistic.gamesWon - user.statistic.gamesWonAsMrX;
            switch (gWD) {
                case 50:
                    if (!oldAchiev.find(ach => ach.title === 'Meisterdetektiv!')) {
                        newAchiev.push(this.winDetectiveAchievements.get(50));
                    }
                    break;
                case 25:
                    if (!oldAchiev.find(ach => ach.title === 'Agent!')) {
                        newAchiev.push(this.winDetectiveAchievements.get(25));
                    }
                    break;
                case 10:
                    if (!oldAchiev.find(ach => ach.title === 'Kommissar!')) {
                        newAchiev.push(this.winDetectiveAchievements.get(10));
                    }
                    break;
                case 5:
                    if (!oldAchiev.find(ach => ach.title === 'Spürnase!')) {
                        newAchiev.push(this.winDetectiveAchievements.get(5));
                    }
                    break;
                case 1:
                    if (!oldAchiev.find(ach => ach.title === 'Anfänger!')) {
                        newAchiev.push(this.winDetectiveAchievements.get(1));
                    }
                    break;
                default:
                    break;
            }
        }
        return newAchiev;
    }

    /**
     * counts all achievementpoints and updates the rank of a user accordingly
     * @param user user with achievements
     * return new rank (or old if nothing changed)
     */
    updateRank(user: User): string {
        let rank = user.rank;
        const achpoints = user.achievements.reduce((acc, ach) => acc + ach.points, 0);

        this.allRanks.forEach((value: string, key: number) => {
            if (achpoints >= key) {
                rank = value;
            }
        });

        return rank;
    }
}
