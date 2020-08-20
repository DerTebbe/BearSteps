import {TestBed} from '@angular/core/testing';
import {RoomService} from './room.service';
import {IonicModule} from '@ionic/angular';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {Room} from '../models/Room';

describe('RoomService', () => {
    let service: RoomService;
    const testRoom: Room = new Room();
    testRoom.roomName = 'testRoom';
    
    beforeEach(() => TestBed.configureTestingModule({
            imports: [
                IonicModule,
                AngularFireModule.initializeApp(environment.firebaseConfig),
                AngularFirestoreModule,
                AngularFireAuthModule,
            ]
        })
    );

    /**
     * before each test: check if the needed test data exists in the database
     * if not: create a new room with needed data
     */
    beforeEach(() => {
        service = TestBed.inject(RoomService);
        service.findRoomByRoomNumber('12345').then((room: Room) => {
            if (!(room.id === 'AuuLruiEhOTxJ1nHAZ7t')) {
                room.id = 'AuuLruiEhOTxJ1nHAZ7t';
                service.update(room);
            }
        }).catch(() => {
            const room: Room = new Room('AuuLruiEhOTxJ1nHAZ7t');
            room.roomNumber =  ('12345');
            service.persist(room);
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /**
     * testing "findRoomByRoomNumber" method
     * the correct room should be found with a roomcode
     * checks for the id of the room
     */
    it('should find room to join', (done) => {
        service.findRoomByRoomNumber('12345').then((room: Room) => {
            expect(room.id).toBe('AuuLruiEhOTxJ1nHAZ7t');
            done();
        });
    });

    /**
     * persisting and finding a room by it's id
     * deletes room at the end
     */
    it('should persist room', (done) => {
        service.persist(testRoom).then((res) => {
            testRoom.id = res.id;
            service.find(res.id).subscribe((action) => {
                let foundroom: Room;
                foundroom = action.payload.data();
                expect(foundroom.roomName).toBe(testRoom.roomName);
                service.delete(testRoom);
                done();
            });
        });
    });

    /**
     * persists and updates a new room
     * deletes room at the end
     */
    it('should update room', (done: DoneFn) => {
        service.persist(testRoom).then((res) => {
            testRoom.id = res.id;
            testRoom.roomName = 'changedRoomname';
            service.update(testRoom).then(() => {
                service.find(res.id).subscribe((action) => {
                    let foundroom: Room;
                    foundroom = action.payload.data();
                    expect(foundroom.roomName).toBe(testRoom.roomName);
                    service.delete(testRoom);
                    done();
                });
            });
        });
    });

    /**
     * method "canRoomCodeBeUsed" gets called with an existing code
     * output should be false
     */
    it('should find existing room code.' , (done) => {
        service.canRoomCodeBeUsed('12345').then((bool: boolean) => {
            expect(bool).toBeFalse();
            done();
        });
    });
});
