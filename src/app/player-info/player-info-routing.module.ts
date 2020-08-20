import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerInfoPage } from './player-info.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerInfoPageRoutingModule {}
