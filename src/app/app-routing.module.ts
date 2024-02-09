import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () =>
      import('./layouts/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
