import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataProtectionPage } from './data-protection.page';

describe('DataProtectionPage', () => {
  let component: DataProtectionPage;
  let fixture: ComponentFixture<DataProtectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProtectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataProtectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

});
