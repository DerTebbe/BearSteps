import {ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameClosingPage } from './game-closing.page';
import {RouterTestingModule} from '@angular/router/testing';

describe('GameClosingPage', () => {
  let component: GameClosingPage;
  let fixture: ComponentFixture<GameClosingPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ GameClosingPage ],
      imports: [IonicModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameClosingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
