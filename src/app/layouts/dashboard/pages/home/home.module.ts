import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { UsersService } from '../../../../core/services/users.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { SharedModule } from '../../../../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    NgChartsModule,
  ],
  providers: [
    UsersService,
    CoursesService,
    EnrollmentsService
  ],
})
export class HomeModule { }
