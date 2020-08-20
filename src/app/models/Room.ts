/**
 * Class that represents a room, in which a game can be played
 */

import {User} from './User';
import {IGameType} from './IGameType';

export class Room {
    /**
     * ID of the room
     */
    id: string;
    /**
     * Maximum number of players that can join the room
     */
    maxAmountPlayers: number;
    /**
     * Array in which the players that joined the room are persisted
     */
    players: User [];
    /**
     * Defines the type of game that is being played
     */
    game: IGameType;
    /**
     * Name of the room
     */
    roomName: string;
    /**
     * Password that needs to be entered when joining a public room
     */
    password: string;
    /**
     * Invitation code for players
     */
    roomNumber: string;
    /**
     * Player who created the room
     */
    creator: User;
    /**
     * Signalizes if the game of the room has started
     */
    started: boolean;
    /**
     * Maximum amount of time a game can last
     */
    maxAmountTime: number;
    /**
     * Is used for exchanging messages between players
     */
    message: string;
    /**
     * Catchword that is et by Mr.X and needs to be entered if a detective wants to catch Mr.X
     */
    catchword: string;

    constructor(id?: string, maxAmountPlayers?: number, players?: User[], game?: IGameType,
                roomName?: string, password?: string, roomNumber?: string, maxAmountTime?: number, catchword?: string) {

        this.id = id;
        this.maxAmountPlayers = maxAmountPlayers;
        this.players = players;
        this.game = game;
        this.roomName = roomName;
        this.started = false;
        if (password) {
            this.password = password;
        }
        this.roomNumber = roomNumber;
        this.maxAmountTime = maxAmountTime;
        this.catchword = catchword;
    }
}
