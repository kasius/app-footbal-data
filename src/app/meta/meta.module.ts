import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetaPageRoutingModule } from './meta-routing.module';

import { MetaPage } from './meta.page';
import { SharedModule } from '../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetaPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [MetaPage]
})
export class MetaPageModule { }
