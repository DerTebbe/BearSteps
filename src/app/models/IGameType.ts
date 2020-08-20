/**
 * Interface that defines the type of a game
 * In the future, further attributes can be added here.
 */

export interface IGameType {
    /**
     * Name of the game
     */
    gameName: string;
    /**
     * Radius in which the game is played e.g 1km
     */
    radius: number;
    /**
     * Signalizes if Mr.X lost by leaving the playing area too often
     */
    mrXLostByLeavingPlayingArea: boolean;
    /**
     * Amount of time the game lasted
     */
    timePlayed: number;
    /**
     * Signalizes who won the game. True if Mr.X won, false if detectives won
     */
    mrXwon: boolean;
}
