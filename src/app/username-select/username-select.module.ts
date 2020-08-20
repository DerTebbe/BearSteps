import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsernameSelectPageRoutingModule } from './username-select-routing.module';

import { UsernameSelectPage } from './username-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsernameSelectPageRoutingModule
  ],
  declarations: [UsernameSelectPage]
})
export class UsernameSelectPageModule {}
