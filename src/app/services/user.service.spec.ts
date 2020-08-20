import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {IonicModule} from '@ionic/angular';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {User} from '../models/User';

describe('UserService', () => {

  let service: UserService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFirestoreModule,
      AngularFireAuthModule,
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(UserService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * tests finding a preexisting user
   */
  it('should find a preexisting user', (done) => {
    service.find('3z5xDMkYDFhAxSFOM75u').subscribe((action) => {
      let founduser: User;
      founduser = action.payload.data();
      expect(founduser.username).toBe('testUser');
      done();
    });
  });
});
