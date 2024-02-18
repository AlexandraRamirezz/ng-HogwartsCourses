import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from './models/course';
import { CoursesService } from '../../../../core/services/courses.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  style = 'bolder';

  displayedColumns = ['courseId', 'title', 'description', 'startDate', 'endDate', 'shift', 'modality', 'teacher', 'actions'];

  courses: Course[] = []
  authUser: any;

  constructor(public matDialog: MatDialog, private coursesService: CoursesService, private authService: AuthService) {
    this.coursesService.getCourses().subscribe({
      next: (course) => {
        this.courses = course;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'The database is currently inaccessible.',
          confirmButtonColor: '#ef5350',
          background: '#303030',
          color: '#d0cccc',
        });
      },
    })
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
  
            this.coursesService.addCourses(newCourse).subscribe({
              next: (courses) => {
                this.courses = courses;
              },
            });
          }
        }
      });
  }  

  onEditCourse(course: Course) {
    this.matDialog
      .open(CourseDialogComponent, {
      data: { course: course, view: false, edit: true }
    }).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.coursesService.updateCourses(course.id, result).subscribe({
            next: (courses) => (this.courses = courses),
          })
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
        this.coursesService.deleteCoursesByID(course.id).subscribe({
          next: (user) => {
            this.courses = user;
            Swal.fire({
              icon: 'success',
              text: 'Course successfully deleted',
              showConfirmButton: false,
              timer: 2000,
              background: '#303030',
              color: '#d0cccc',
            });
          },
          error: (error) => {
            console.error('Error deleting course: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the course.',
              confirmButtonColor: '#ef5350',
              background: '#303030',
              color: '#d0cccc',
            });
          }
        });
      }
    });
  }
}
