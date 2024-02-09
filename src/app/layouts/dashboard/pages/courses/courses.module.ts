import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesService } from '../../../../core/courses.service';
import { EnrollmentsService } from '../../../../core/enrollments.service';
import { UsersService } from '../../../../core/users.service';

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
    CoursesComponent,
    CourseDialogComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
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
  exports: [CoursesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    CoursesService,
    EnrollmentsService
  ],
})
export class CoursesModule { }
