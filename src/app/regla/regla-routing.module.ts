import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReglaPage } from './regla.page';

const routes: Routes = [
  {
    path: '',
    component: ReglaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReglaPageRoutingModule {}
