import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { Course } from './models/course';
import { CoursesService } from '../../../../core/services/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  style = 'bolder';

  displayedColumns = ['courseId', 'title', 'description', 'startDate', 'endDate', 'shift', 'modality', 'teacher', 'actions'];

  courses: Course[] = []

  constructor(public matDialog: MatDialog, private coursesService: CoursesService) { 
    this.coursesService.getCourses().subscribe({
      next: (course) => {
        this.courses = course;
      }
    })
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
              next: (user) => {
                this.courses = user;
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
          this.coursesService.updateCourses(course.courseId, result).subscribe({
            next: (user) => (this.courses = user),
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

  onDeleteCourse(courseId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e88e5',
      cancelButtonColor: '#c2185b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      background: '#303030',
      color: 'white',
    }).then((result) => {
      if (result.isConfirmed) {
        this.coursesService.deleteCoursesByID(courseId).subscribe({
          next: (user) => {
            this.courses = user;
            Swal.fire({
              icon: 'success',
              text: 'Course successfully deleted',
              showConfirmButton: false,
              timer: 1500,
              background: '#303030',
              color: 'white',
            });
          },
          error: (error) => {
            console.error('Error deleting course: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the course.',
              background: '#303030',
              color: 'white',
            });
          }
        });
      }
    });
  }
}
