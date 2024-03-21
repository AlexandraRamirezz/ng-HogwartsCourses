import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from './models/course';
import { CoursesService } from '../../../../core/services/courses.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { CoursesActions } from './store/courses.actions';
import { selectCourses } from './store/courses.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnDestroy {
  style = 'bolder';

  displayedColumns = ['courseId', 'title', 'description', 'startDate', 'endDate', 'shift', 'modality', 'teacher', 'actions'];

  courses: Course[] = []
  coursesSubscription?: Subscription;
  authUser: any;

  constructor(public matDialog: MatDialog, private authService: AuthService, private store: Store) {
    this.coursesSubscription = this.store.select(selectCourses).subscribe({
      next: (courses) => {
        this.courses = courses;
      }
    })
    this.store.dispatch(CoursesActions.loadCourses())
  }

  ngOnInit(): void {
    this.authUser = this.authService.authUser;
  }

  onCreateCourse(): void {
    this.matDialog
      .open(CourseDialogComponent, {
        data: { view: false, edit: false }
      }).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            const maxId = Math.max(...this.courses.map(course => course.courseId), 0);
            const newId = maxId + 1;
            const newCourse = {
              ...result,
              courseId: newId,
            };
          }
        }
      })
  }  

  onEditCourse(course: Course) {
    this.matDialog
      .open(CourseDialogComponent, {
        data: { course: course, view: false, edit: true }
    }).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          result.courseId = course.courseId;
          this.store.dispatch(CoursesActions.modifyCourses({ id: course.id, data: result }));
        }
      }
    })
  }

  onViewCourse(course: Course) {
    this.matDialog
      .open(CourseDialogComponent, {
        data: { course: course, view: true, edit: false }
    })
  }

  onDeleteCourse(course: Course) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffe0b2',
      cancelButtonColor: '#ef5350',
      confirmButtonText: '<span style="color:black;">Yes, delete</span>',
      cancelButtonText: 'Cancel',
      background: '#303030',
      color: '#d0cccc',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(CoursesActions.deleteCourses({id: course.id}));
      }
    });
  }

  ngOnDestroy(): void {
    this.coursesSubscription?.unsubscribe();
  }
}
