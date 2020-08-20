import {ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameInfoPage } from './game-info.page';

describe('GameInfoPage', () => {
  let component: GameInfoPage;
  let fixture: ComponentFixture<GameInfoPage>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [ GameInfoPage ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GameInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    done();
  });

});
