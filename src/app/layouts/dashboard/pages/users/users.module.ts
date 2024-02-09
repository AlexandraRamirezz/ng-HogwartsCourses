import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../../../core/users.service';
import { EnrollmentsService } from '../../../../core/enrollments.service';
import { CoursesService } from '../../../../core/courses.service';
import { UsersRoutingModule } from './users-routing.module';

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
    UsersComponent,
    UserDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
  exports: [UsersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    EnrollmentsService,
    CoursesService,
  ],
})
export class UsersModule { }