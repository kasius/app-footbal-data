import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SimulacionPageRoutingModule } from './simulacion-routing.module';

import { SimulacionPage } from './simulacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SimulacionPageRoutingModule
  ],
  declarations: [SimulacionPage]
})
export class SimulacionPageModule {}
