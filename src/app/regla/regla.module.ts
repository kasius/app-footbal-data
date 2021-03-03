import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReglaPageRoutingModule } from './regla-routing.module';

import { ReglaPage } from './regla.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReglaPageRoutingModule
  ],
  declarations: [ReglaPage]
})
export class ReglaPageModule {}
