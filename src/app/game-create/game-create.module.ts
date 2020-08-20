import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameCreatePageRoutingModule } from './game-create-routing.module';

import { GameCreatePage } from './game-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameCreatePageRoutingModule
  ],
  declarations: [GameCreatePage]
})
export class GameCreatePageModule {}
