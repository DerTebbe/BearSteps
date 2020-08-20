import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PlayerInfoPage} from './player-info.page';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';
import {CountdownModule} from 'ngx-countdown';

describe('PlayerInfoPage', () => {
    let component: PlayerInfoPage;
    let fixture: ComponentFixture<PlayerInfoPage>;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [PlayerInfoPage],
            imports: [IonicModule,
                AngularFireModule.initializeApp(environment.firebaseConfig),
                CountdownModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [{
                provide: ActivatedRoute,
                useValue: {
                    snapshot: {
                        paramMap: convertToParamMap({roomID: 'AuuLruiEhOTxJ1nHAZ7t'})
                    }
                }
            }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerInfoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });

});
