import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentsComponent } from './enrollments.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { UsersService } from '../../../../core/services/users.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { RouterModule } from '@angular/router';

// Angular material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    EnrollmentsComponent,
    EnrollmentDialogComponent,
  ],
  imports: [
    CommonModule,
    EnrollmentsRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
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