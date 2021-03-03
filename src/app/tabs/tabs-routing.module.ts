import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'meta',
        loadChildren: () => import('../meta/meta.module').then(m => m.MetaPageModule)
      },
      {
        path: 'regla',
        loadChildren: () => import('../regla/regla.module').then(m => m.ReglaPageModule)
      },
      {
        path: 'simulacion',
        loadChildren: () => import('../simulacion/simulacion.module').then(m => m.SimulacionPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
