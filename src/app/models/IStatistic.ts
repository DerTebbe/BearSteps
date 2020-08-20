/**
 * Interface representing statistics of a user
 */

export interface IStatistic {
    /**
     * Number of games the user has played
     */
    gamesPlayed: number;
    /**
     * Number of games the user has played as Mr.X
     */
    gamesPlayedAsMrX: number;
    /**
     * Amount of games won by a user
     */
    gamesWon: number;
    /**
     * Amount of games won by a user as Mr.X
     */
    gamesWonAsMrX: number;
}
