import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UsersService } from '../../../../../../core/services/users.service';
import { EnrollmentsService } from '../../../../../../core/services/enrollments.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Enrollment } from '../../../enrollments/models/enrollment';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  hide = true;
  userForm: FormGroup;
  enrollments: any[] = [];
  enrollmentsStudent: any[] = [];
  viewMode: boolean;
  authUser: any;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<UserDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { user: User, view: boolean, edit: boolean },
    private usersService: UsersService,
    private enrollmentsService: EnrollmentsService,
    private authService: AuthService) {
    this.viewMode = this.data.view;
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', Validators.required],
      magicWandCore: ['', Validators.required],
      role: ['', Validators.required],
    });
    if (this.data.edit) {
      this.userForm.patchValue(this.data.user);
    }
    if (this.data.view) {
      this.userForm.patchValue(this.data.user);
      this.userForm.get('firstName')?.disable();
      this.userForm.get('lastName')?.disable();
      this.userForm.get('gender')?.disable();
      this.userForm.get('email')?.disable();
      this.userForm.get('password')?.disable();
      this.userForm.get('dateOfBirth')?.disable();
      this.userForm.get('magicWandCore')?.disable();
      this.userForm.get('role')?.disable();
    }
  }

  ngOnInit(): void {
    this.getCourses();
    this.authUser = this.authService.authUser;
  }

  getCourses(): void {
    if (this.data && this.data.user && this.data.user.userId) {
      this.usersService.getUsers().subscribe({
        next: (users: User[]) => {
          this.enrollmentsService.getEnrollments().subscribe({
            next: (enrollments: any[]) => {
              this.enrollments = enrollments;
              const currentUser = users.find(user => user.userId === this.data.user.userId);
              if (currentUser) {
                this.usersService.checkCourses(currentUser, enrollments).subscribe({
                  next: (enrollmentsStudent: any[]) => {
                    this.enrollmentsStudent = enrollmentsStudent;
                  },
                  error: (error) => {
                    console.error('Error checking student courses: ' + error);
                  }
                });
              }
            },
            error: (error) => {
              console.error('Error getting enrollments: ' + error);
            }
          });
        },
        error: (error) => {
          console.error('Failed to get users: ' + error);
        }
      });
    } else {
      console.error('this.data or this.data.user is undefined or null.');
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      this.showErrorMessage('Please fill in all fields correctly.');
      return;
    }
    this.matDialogRef.close(this.userForm.value);
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#ffe0b2',
      background: '#303030',
      color: 'white',
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
          this.enrollmentsService.deleteEnrollmentsByID(data.id).subscribe({
            next: () => {
              this.getCourses();
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
              console.error('Error deleting enrollment: ' + error);
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

  togglePasswordVisibility() {
    if (this.isAuthorizedToSeePassword()) {
      this.hide = !this.hide;
    }
  }

  isAuthorizedToSeePassword(): boolean {
    if (!this.authUser || !this.data.user) return false;
    if (this.authUser.role === 'Administrator') {
      if (this.data.user.role === 'Administrator' && this.authUser.userId !== this.data.user.userId) {
        return false;
      } else {
        return true;
      }
    }
    return this.authUser.userId === this.data.user.userId;
  }  
}
