import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import * as fromMeta from '../store/meta.reducer';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    StoreModule.forFeature(fromMeta.myMetasKey, fromMeta.reducerMeta)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
