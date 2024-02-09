import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./pages/enrollments/enrollments.module').then((m) => m.EnrollmentsModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
