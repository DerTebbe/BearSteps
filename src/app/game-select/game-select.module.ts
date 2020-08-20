import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameSelectPageRoutingModule } from './game-select-routing.module';

import { GameSelectPage } from './game-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameSelectPageRoutingModule
  ],
  declarations: [GameSelectPage]
})
export class GameSelectPageModule {}
