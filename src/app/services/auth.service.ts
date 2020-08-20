import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserService} from './user.service';
import {Observable, of} from 'rxjs';
import {User} from '../models/User';
import {map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';


/**
 * Service for authentication of users using FirebaseAuth
 */
@Injectable({
    providedIn: 'root'
})

export class AuthService {

    /**
     * The logged in user is stored here as an Observable
     */
    user: Observable<User>;

    /**
     * Necessary dependencies are injected
     * @param auth
     * @param userservice
     */
    constructor(private auth: AngularFireAuth, private userservice: UserService) {
        this.user = this.observeLoggedInUser();
    }

    /**
     * Registers a user
     * @param email Email of the user
     * @param username Username of the user
     * @param password Password of the user
     */
    register(email, username, password): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.auth.createUserWithEmailAndPassword(email, password).then((res) => {
                this.userservice.persist(email, username, res.user.uid);
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Signs in users
     * @param email Email of the user to be logged in
     * @param password Password of the user to be logged in
     */
    login(email, password) {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        return new Promise<any>(((resolve, reject) => {
            this.auth.signInWithEmailAndPassword(email, password)
                .then(
                    res => {
                        resolve(res);
                    },
                    err => reject(err));
        }));
    }

    /**
     * Signs in a user anonymously
     */
    anonymusSignIn() {
        return new Promise<any>(((resolve, reject) => {
            this.auth.signInAnonymously().then(
                res => {
                    resolve(res);
                },
                err => reject(err)
            );
        }));
    }

    /**
     * Returns the latest AuthState of logged-in user
     */
    checkAuthState(): Observable<firebase.User | null> {
        return this.auth.authState;
    }

    /**
     * Signs out a user
     */
    SignOut() {
        return this.auth.signOut();
    }

    /**
     * Returns an observable to observe the logged-in user
     */
    observeLoggedInUser(): Observable<User> {
        return this.checkAuthState().pipe(switchMap((authState) => {
            if (!authState) {
                return of(null);
            }
            return this.userservice.find(authState.uid).pipe(map(a => {
                const user: User = a.payload.data();
                user.id = a.payload.id;
                return user;
            }));
        }));
    }
}
