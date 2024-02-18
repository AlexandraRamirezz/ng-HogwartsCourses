import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course';
import { CoursesService } from '../../../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../../../core/services/enrollments.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Enrollment } from '../../../enrollments/models/enrollment';
import { UsersService } from '../../../../../../core/services/users.service';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {
  courseForm: FormGroup;
  users: any[] = [];
  enrollments: any[] = [];
  enrollmentsCourse: any[] = [];
  viewMode: boolean;
  authUser: any;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<CourseDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { course: Course, view: boolean, edit: boolean },
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
    private authService: AuthService,
    private usersService: UsersService) {
    this.viewMode = this.data.view;
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      shift: ['', Validators.required],
      modality: ['', Validators.required],
      teacher: ['', [Validators.required, Validators.minLength(3)]],
    });
    if (this.data.edit) {
      this.courseForm.patchValue(this.data.course);
    }
    if (this.data.view) {
      this.courseForm.patchValue(this.data.course);
      this.courseForm.get('title')?.disable();
      this.courseForm.get('description')?.disable();
      this.courseForm.get('startDate')?.disable();
      this.courseForm.get('endDate')?.disable();
      this.courseForm.get('shift')?.disable();
      this.courseForm.get('modality')?.disable();
      this.courseForm.get('teacher')?.disable();
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.authUser = this.authService.authUser;
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.usersService.getTeachers().subscribe(teachers => {
      this.users = teachers;
    });
  }

  getUsers(): void {
    if (this.data && this.data.course && this.data.course.courseId) {
      this.coursesService.getCourses().subscribe({
        next: (courses: Course[]) => {
          this.enrollmentsService.getEnrollments().subscribe({
            next: (enrollments: any[]) => {
              this.enrollments = enrollments;
              const currentCourse = courses.find(course => course.courseId === this.data.course.courseId);
              if (currentCourse) {
                this.coursesService.checkStudents(currentCourse, enrollments).subscribe({
                  next: (enrollmentsCourse: any[]) => {
                    this.enrollmentsCourse = enrollmentsCourse;
                  },
                  error: (error) => {
                    console.error('Error checking student courses: ', error);
                  }
                });
              }
            },
            error: (error) => {
              console.error('Error getting enrollments: ', error);
            }
          });
        },
        error: (error) => {
          console.error('Failed to get courses:', error);
        }
      });
    } else {
      console.error('this.data or this.data.course is undefined or null.');
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      this.showErrorMessage('Please fill in all fields correctly.');
      return;
    }
    this.matDialogRef.close(this.courseForm.value);
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#ef5350',
      background: '#303030',
      color: '#d0cccc',
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isAuthorizedToDelete(element: Enrollment): boolean {
    if (!this.authUser) return false;
    if (this.authUser.role === 'Administrator') return true;
    if (this.authUser.role === 'Student' && this.authUser.userId === element.studentId) return true;
    return false;
  }

  onDelete(data: Enrollment) {
    if (this.isAuthorizedToDelete(data)) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be reversed',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffe0b2',
        cancelButtonColor: '#ef5350',
        background: '#303030',
        color: '#d0cccc',
        confirmButtonText: '<span style="color:black;">Yes, delete</span>',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.coursesService.deleteEnrollmentsByID(data.id).subscribe({
            next: () => {
              this.getUsers();
              Swal.fire({
                icon: 'success',
                title: 'Successful discharge',
                showConfirmButton: false,
                background: '#303030',
                color: '#d0cccc',
                timer: 2000
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You do not have permission to delete this enrollment.',
        confirmButtonColor: '#ef5350',
        background: '#303030',
        color: '#d0cccc',
      });
    }
  }
}
