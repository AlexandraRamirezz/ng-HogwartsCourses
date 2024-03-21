import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { UsersService } from '../../../../core/services/users.service';
import { SharedModule } from '../../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { CoursesEffects } from './store/courses.effects';
import { StoreModule } from '@ngrx/store';
import { coursesFeature } from './store/courses.reducer';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseDialogComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    EnrollmentsModule,
    StoreModule.forFeature(coursesFeature),
    EffectsModule.forFeature([CoursesEffects]),
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
