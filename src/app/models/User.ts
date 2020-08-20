/**
 * Class that represents a user.
 * Email adress, password and achievements are optional, so unregistered users can also be represented by this class
 */
import {Achievement} from './Achievement';
import {IStatistic} from './IStatistic';

export class User {
    /**
     * ID of the user
     */
    id: string;
    /**
     * Username
     */
    username: string;
    /**
     * Array containing achievements of the user
     */
    achievements: Achievement[] = [];
    /**
     * Email
     */
    email: string;
    /**
     * Latitude of the user
     */
    latitude: number;
    /**
     * Longitude of the user
     */
    longtitude: number;
    /**
     * Role of the user in a game
     */
    role: string;
    /**
     * Path to the avatar of the user
     */
    picture: string;
    /**
     * Represents the statistics of a user
     */
    statistic: IStatistic;
    /**
     * Rank of the user. Default is 'BearSteps Anfänger'. After playing game it iscalculated from achievement points
     */
    rank = 'BearSteps-Anfänger';

    constructor(id?: string, username?: string, email?: string) {
        this.id = id;
        this.username = username;
        if (email) {
            this.email = email;
        }
    }
}
