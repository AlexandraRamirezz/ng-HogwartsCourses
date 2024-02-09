import { Component } from '@angular/core';
import { Enrollment } from './models/enrollment';
import { User } from '../users/models/user';
import { Course } from '../courses/models/course';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { UsersService } from '../../../../core/services/users.service';
import { CoursesService } from '../../../../core/services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
})
export class EnrollmentsComponent {
  style = 'bolder';

  displayedColumns = ['enrollmentId', 'courseTitle', 'studentName', 'shift', 'modality', 'actions'];

  enrollments: Enrollment[] = []
  users: User[] = []
  courses: Course[] = []

  constructor(private enrollmentsService: EnrollmentsService, private usersService: UsersService, private coursesService: CoursesService, public matDialog: MatDialog) {
    this.enrollmentsService.getEnrollments().subscribe({
      next: (enrollment) => {
        this.enrollments = enrollment;
      }
    })

    this.usersService.getUsers().subscribe({
      next: (user) => {
        this.users = user;
      }
    })

    this.coursesService.getCourses().subscribe({
      next: (course) => {
        this.courses = course;
      }
    })
  }

  onCreateEnrollment(): void {
    this.matDialog
      .open(EnrollmentDialogComponent, {
        data: { view: false, edit: false }
      }).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            const maxId = Math.max(...this.enrollments.map(enrollment => enrollment.enrollmentId), 0);
            const newId = maxId + 1;
            const newEnrollment = {
              ...result,
              enrollmentId: newId,
            };

            this.enrollmentsService.addEnrollments(newEnrollment, this.users, this.courses).subscribe({
              next: (enrollment) => {
                this.enrollments = enrollment;
              },
            });
          }
        }
      });
  }

  onEditEnrollment(enrollment: Enrollment) {
    this.matDialog
      .open(EnrollmentDialogComponent, {
        data: { enrollment: enrollment, view: false, edit: true }
      }).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.enrollmentsService.updateEnrollments(enrollment.enrollmentId, result, this.courses).subscribe({
              next: (enrollment) => (this.enrollments = enrollment),
            })
          }
        }
      })
  }

  onViewEnrollment(enrollment: Enrollment) {
    this.matDialog
      .open(EnrollmentDialogComponent, {
        data: { enrollment: enrollment, view: true, edit: false }
      })
  }

  onDeleteEnrollment(enrollmentId: number) {
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
        this.enrollmentsService.deleteEnrollmentsByID(enrollmentId).subscribe({
          next: (enrollment) => {
            this.enrollments = enrollment;
            Swal.fire({
              icon: 'success',
              text: 'Enrollment successfully deleted',
              showConfirmButton: false,
              timer: 1500,
              background: '#303030',
              color: 'white',
            });
          },
          error: (error) => {
            console.error('Error deleting enrollment: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the enrollment.',
              background: '#303030',
              color: 'white',
            });
          }
        });
      }
    });
  }
}
