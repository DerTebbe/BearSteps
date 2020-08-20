import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameEndPageRoutingModule } from './game-end-routing.module';

import { GameEndPage } from './game-end.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameEndPageRoutingModule
  ],
  declarations: [GameEndPage]
})
export class GameEndPageModule {}
