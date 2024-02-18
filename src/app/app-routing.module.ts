import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layouts/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadChildren: () =>
    import('./layouts/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'auth', pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
