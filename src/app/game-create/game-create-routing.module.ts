import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameCreatePage } from './game-create.page';

const routes: Routes = [
  {
    path: '',
    component: GameCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameCreatePageRoutingModule {}
