import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameLobbyPage } from './game-lobby.page';

const routes: Routes = [
  {
    path: '',
    component: GameLobbyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameLobbyPageRoutingModule {}
