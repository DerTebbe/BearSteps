import {
    Action,
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument, DocumentChangeAction,
    DocumentSnapshot, QuerySnapshot
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Room} from '../models/Room';
import {User} from '../models/User';
import {map, take} from 'rxjs/operators';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service to handle all room-database-operations
 */
export class RoomService {

    /**
     * Represents the collection in firebase where room documents are stored
     */
    roomCollection: AngularFirestoreCollection<Room>;
    /**
     * Represents the subcollection in firebase where players of a room are stored. They are stored as an user object
     */
    playerCollection: AngularFirestoreCollection<User>;

    /**
     * Prepares a room-object to be saved in the database
     * @param room room object
     */
    static prepare(room: Room): Room {
        const copy = {...room};
        delete copy.id;
        copy.game = copy.game || null;
        copy.maxAmountPlayers = copy.maxAmountPlayers || null;
        copy.maxAmountTime = copy.maxAmountTime || null;
        copy.password = copy.password || null;
        // @ts-ignore
        copy.players = this.preparePlayers(room.players) || [];
        copy.roomName = copy.roomName || null;
        copy.roomNumber = copy.roomNumber || null;
        copy.started = copy.started || null;
        copy.message = copy.message || null;
        copy.catchword = copy.catchword || null;
        return copy;
    }

    /**
     * Prepares players to be saved in database
     * @param players player object
     */
    static preparePlayers(players: User[]) {
        if (players) {
            const newPlayers: {}[] = [];
            for (const player of players) {
                newPlayers.push({...player});
            }
            return newPlayers;
        } else {
            return null;
        }
    }

    /**
     * Inits the path to the room collection
     * @param afs
     */
    constructor(private afs: AngularFirestore) {
        this.roomCollection = afs.collection<Room>('rooms');
    }

    /**
     * Saves a room in the database
     * @param room Room to be persisted
     */
    persist(room: Room): Promise<any> {
        return new Promise<any>((resolve) => {
            this.createUniqueRoomNumber().then((roomNumber: string) => {
                const newRoom = RoomService.prepare(room);
                newRoom.roomNumber = roomNumber;
                this.roomCollection.add(newRoom).then((res) => {
                    resolve(res);
                });
            });
        });
    }

    /**
     * Updates on room
     * @param room Room to be updated
     */
    update(room: Room) {
        return this.roomCollection.doc(room.id).update(RoomService.prepare(room));
    }

    /**
     * Deletes a room
     * @param room Room to be deleted
     */
    delete(room: Room): void {
        this.roomCollection.doc(room.id).delete();
    }

    /**
     * Finds a room by its id
     * @param id ID of the room to be found
     */
    find(id: string): Observable<Action<DocumentSnapshot<Room>>> {
        const doc: AngularFirestoreDocument<Room> = this.roomCollection.doc(id);
        return doc.snapshotChanges();
    }


    /**
     * Finds a room by its id but without subscribing to changes
     * @param id ID of the room to be found
     */
    findRoom(id: string): Observable<Room> {
        return this.roomCollection.doc(id).get().pipe(
            map(a => {
                const data = a.data();
                data.date = data.date.toDate();
                data.id = a.id;
                return {...data} as Room;
            })
        );
    }


    /**
     * Adds a player as an user object to the player subcollection of a room document
     * @param id ID of the room the player needs to be added to
     * @param user User object of the player thats needs to be added
     */
    addPlayer(id: string, user: User){
        this.playerCollection = this.afs.collection<User>('rooms/' + id + '/player');
        this.playerCollection.doc(user.id).set(UserService.prepareAsPlayer(user));
    }

    /**
     * Updates an player in the player subcollection of a room document
     * @param roomID ID of the room the player belongs to
     * @param user User object of the player that needs to be updated
     */
    updatePlayer(roomID: string, user: User){
        this.playerCollection = this.afs.collection<User>('rooms/' + roomID + '/player');
        this.playerCollection.doc(user.id).update(UserService.prepareAsPlayer(user));
    }

    /**
     * Deletes an player from the player subcollection in room document
     * @param roomID ID of the room the player belongs to
     * @param userID ID of the user that needs to be deleted
     */
    deletePlayer(roomID: string, userID: string){
        this.playerCollection = this.afs.collection<User>('rooms/' + roomID + '/player');
        this.playerCollection.doc(userID).delete();
    }

    /**
     * Gets all players from the player subcollection of a room document
     * @param roomID ID of the room the players need to be fetched from
     */
    getAllPlayers(roomID: string): Observable<User[]> {
        this.playerCollection = this.afs.collection<User>('rooms/' + roomID + '/player');
        const changeActions: Observable<DocumentChangeAction<User>[]> = this.playerCollection.snapshotChanges();
        return changeActions.pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                data.id = a.payload.doc.id;
                return {...data} as User;
            })));
    }


    /**
     * Finds a room in the database with the corresponding room-number
     * @param uNumber room-number
     * @return Promise<Room> Resolves Room if found
     */
    findRoomByRoomNumber(uNumber: string): Promise<Room> {
        return new Promise<Room>((resolve, reject) => {
            this.afs.collection('rooms', ref => ref.where('roomNumber', '==', uNumber)).get().subscribe((rooms) => {
                if (rooms.docs.length !== 1) {
                    reject('Raum konnte nicht gefunden werden');
                } else {
                    const roomData = rooms.docs[0].data();
                    const id = rooms.docs[0].id;
                    resolve({id, ...roomData} as Room);
                }
            });
        });
    }

    /**
     * Checks if a given number is in use
     * @param uNumber Unique room-number that is checked
     * @return boolean Marks if the room is used
     */
    canRoomCodeBeUsed(uNumber: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.afs.collection('rooms', ref => ref.where('roomNumber', '==', uNumber)).get().subscribe((rooms) => {
                if (rooms.docs.length === 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * creates a unique random number which can be used as a roomcode
     */
    createUniqueRoomNumber(): Promise<string> {
        return new Promise<string>((resolve) => {
            let newNumber: string;
            newNumber = Math.floor(Math.random() * 1000 + 9999).toString();
            this.canRoomCodeBeUsed(newNumber).then((result) => {
                if (result) {
                    resolve(newNumber);
                }else {
                    resolve(this.createUniqueRoomNumber());
                }
            });
        });
    }
}
