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
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
})
export class EnrollmentsComponent {
  style = 'bolder';

  displayedColumns = ['enrollmentId', 'courseTitle', 'startDate', 'modality', 'teacher', 'studentName', 'email', 'actions'];

  enrollments: Enrollment[] = []
  users: User[] = []
  courses: Course[] = []
  authUser: any;

  constructor(private enrollmentsService: EnrollmentsService, private usersService: UsersService, private coursesService: CoursesService, public matDialog: MatDialog, private authService: AuthService) {
    this.enrollmentsService.getEnrollments().subscribe({
      next: (enrollment) => {
        this.enrollments = enrollment;
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

    this.usersService.getUsers().subscribe({
      next: (user) => {
        this.users = user;
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
            this.enrollmentsService.updateEnrollments(enrollment.id, result, this.courses).subscribe({
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

  onDeleteEnrollment(enrollment: Enrollment) {
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
        this.enrollmentsService.deleteEnrollmentsByID(enrollment.id).subscribe({
          next: (enrollment) => {
            this.enrollments = enrollment;
            Swal.fire({
              icon: 'success',
              text: 'Enrollment successfully deleted',
              showConfirmButton: false,
              timer: 2000,
              background: '#303030',
              color: '#d0cccc',
            });
          },
          error: (error) => {
            console.error('Error deleting enrollment: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the enrollment.',
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
