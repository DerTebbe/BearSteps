import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterAppPageRoutingModule } from './enter-app-routing.module';

import { EnterAppPage } from './enter-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterAppPageRoutingModule
  ],
  declarations: [EnterAppPage]
})
export class EnterAppPageModule {}
