import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameClosingPageRoutingModule } from './game-closing-routing.module';

import { GameClosingPage } from './game-closing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameClosingPageRoutingModule
  ],
  declarations: [GameClosingPage]
})
export class GameClosingPageModule {}
