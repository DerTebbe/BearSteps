import {ComponentFixture, TestBed} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatisticsPage } from './statistics.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('StatisticsPage', () => {
  let component: StatisticsPage;
  let fixture: ComponentFixture<StatisticsPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsPage ],
      imports: [IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule.withRoutes([])]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
