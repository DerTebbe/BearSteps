import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameSelectPage } from './game-select.page';

const routes: Routes = [
  {
    path: '',
    component: GameSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameSelectPageRoutingModule {}
