import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UsersService } from '../../../../core/services/users.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    UserDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ],
  exports: [UsersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    UsersService,
    EnrollmentsService,
    CoursesService,
  ],
})
export class UsersModule {}