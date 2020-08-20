import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterAppPage } from './enter-app.page';

const routes: Routes = [
  {
    path: '',
    component: EnterAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterAppPageRoutingModule {}
