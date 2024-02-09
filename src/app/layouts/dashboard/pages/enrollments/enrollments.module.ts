import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentsComponent } from './enrollments.component';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { UsersService } from '../../../../core/services/users.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    EnrollmentsComponent,
    EnrollmentDialogComponent,
  ],
  imports: [
    CommonModule,
    EnrollmentsRoutingModule,
    SharedModule
  ],
  exports: [EnrollmentsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    EnrollmentsService,
    CoursesService,
  ],
})
export class EnrollmentsModule { }