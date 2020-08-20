import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameEndPage } from './game-end.page';

const routes: Routes = [
  {
    path: '',
    component: GameEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameEndPageRoutingModule {}
