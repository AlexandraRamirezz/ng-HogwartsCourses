import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { UsersService } from '../../../../core/services/users.service';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseDialogComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
  ],
  exports: [CoursesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    CoursesService,
    EnrollmentsService
  ],
})
export class CoursesModule { }
