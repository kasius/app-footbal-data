import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListExpandableComponent } from './list-expandable/list-expandable.component';
import { FormMetaComponent } from './form-meta/form-meta.component';
import { FormReglaComponent } from './form-regla/form-regla.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [ListExpandableComponent, FormMetaComponent, FormReglaComponent],
  exports: [ListExpandableComponent, FormMetaComponent, FormReglaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
