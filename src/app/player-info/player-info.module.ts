import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerInfoPageRoutingModule } from './player-info-routing.module';

import { PlayerInfoPage } from './player-info.page';
import {CountdownModule} from 'ngx-countdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PlayerInfoPageRoutingModule,
        CountdownModule
    ],
  declarations: [PlayerInfoPage]
})
export class PlayerInfoPageModule {}
