import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameLobbyPageRoutingModule } from './game-lobby-routing.module';

import { GameLobbyPage } from './game-lobby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameLobbyPageRoutingModule
  ],
  declarations: [GameLobbyPage]
})
export class GameLobbyPageModule {}
