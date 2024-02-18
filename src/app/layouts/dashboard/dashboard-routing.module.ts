import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
    data: { title: 'List of users' },
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then((m) => m.CoursesModule),
    data: { title: 'List of courses' },
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./pages/enrollments/enrollments.module').then((m) => m.EnrollmentsModule),
    data: { title: 'List of enrollments' },
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    data: { title: 'Home' },
  },
  {
    path: "",
    redirectTo: "home", pathMatch: "prefix" 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
