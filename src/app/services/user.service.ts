import {Injectable} from '@angular/core';
import {Action, AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot} from '@angular/fire/firestore';
import {User} from '../models/User';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

/**
 * Service to handle all user-database-operations
 */
export class UserService {

    /**
     * Represents the collection in firebase where users are stored
     */
    userCollection: AngularFirestoreCollection<User>;

    /**
     * Prepares a user object to be persisted in database
     * @param user
     */
    static prepare(user: User): User {
        const copy = {...user};
        delete copy.id;
        delete copy.latitude;
        delete copy.longtitude;
        delete copy.role;
        copy.email = copy.email || null;
        copy.username = copy.username || null;
        copy.achievements = user.achievements.map((o) => Object.assign({}, o));
        copy.picture = copy.picture || null;
        copy.statistic = copy.statistic || null;
        return copy;
    }

    /**
     * Prepares a user object to be persisted in player subcollection within room collection
     * @param user
     */
    static prepareAsPlayer(user: User): User {
        const copy = {...user};
        delete copy.id;
        copy.email = copy.email || null;
        copy.username = copy.username || null;
        copy.achievements = user.achievements.map((o) => Object.assign({}, o));
        copy.latitude = copy.latitude || null;
        copy.longtitude = copy.longtitude || null;
        copy.role = copy.role || null;
        copy.picture = copy.picture || null;
        return copy;
    }

    /**
     * Inits the path to the user collection in firebase
     * @param afs
     */
    constructor(private afs: AngularFirestore){
        this.userCollection = afs.collection<User>('user');
    }

    /**
     * Persists a user in database
     * @param email Email of the user to be persisted
     * @param username Username of the user to be persisted
     * @param id ID of the user to be persisted
     */
    persist(email: string, username: string, id: string) {
        const user: User = new User(id, username, email);
        user.statistic = {
            gamesWonAsMrX: 0,
            gamesPlayedAsMrX: 0,
            gamesPlayed: 0,
            gamesWon: 0
        };
        this.userCollection.doc(id).set(UserService.prepare(user));
    }

    /**
     * Gets a user from database by ID
     * @param id ID of the user to be fetched
     */
    getSingleUser(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.userCollection.doc(id).get().subscribe((user) => {
                resolve(user.data() as User);
            }, () => {
                reject();
            });
        });
    }

    /**
     * Persists an anonymous user in database
     * @param user
     */
    persistAnonymus(user: User){
        this.userCollection.doc(user.id).set(UserService.prepare(user));
    }

    /**
     * Returns an observable to oberserve an user
     * @param id
     */
    find(id: string): Observable<Action<DocumentSnapshot<User>>> {
        const doc: AngularFirestoreDocument<User> = this.userCollection.doc(id);
        return doc.snapshotChanges();
    }

    /**
     * Deletes an user from database
     * @param id ID of the user to be deleted
     */
    delete(id: string){
        this.userCollection.doc(id).delete();
    }

    /**
     * Updates a user in firebase
     * @param user User object that needs to be updated
     */
    update(user: User): Promise<void> {
        return this.userCollection.doc(user.id).update(UserService.prepare(user));
    }
}
