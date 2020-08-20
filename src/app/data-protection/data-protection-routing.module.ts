import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataProtectionPage } from './data-protection.page';

const routes: Routes = [
  {
    path: '',
    component: DataProtectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProtectionPageRoutingModule {}
