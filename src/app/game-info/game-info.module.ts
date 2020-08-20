import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameInfoPageRoutingModule } from './game-info-routing.module';

import { GameInfoPage } from './game-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameInfoPageRoutingModule
  ],
  declarations: [GameInfoPage]
})
export class GameInfoPageModule {}
