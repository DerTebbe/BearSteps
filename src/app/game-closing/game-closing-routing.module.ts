import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameClosingPage } from './game-closing.page';

const routes: Routes = [
  {
    path: '',
    component: GameClosingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameClosingPageRoutingModule {}
