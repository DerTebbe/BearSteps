import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameInfoPage } from './game-info.page';

const routes: Routes = [
  {
    path: '',
    component: GameInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameInfoPageRoutingModule {}
