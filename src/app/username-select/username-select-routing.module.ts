import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsernameSelectPage } from './username-select.page';

const routes: Routes = [
  {
    path: '',
    component: UsernameSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsernameSelectPageRoutingModule {}
