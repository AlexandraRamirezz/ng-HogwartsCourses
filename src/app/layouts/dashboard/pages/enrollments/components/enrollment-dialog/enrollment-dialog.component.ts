import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enrollment } from '../../models/enrollment';
import { CoursesService } from '../../../../../../core/services/courses.service';
import { UsersService } from '../../../../../../core/services/users.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-enrollment-dialog',
  templateUrl: './enrollment-dialog.component.html',
  styleUrls: ['./enrollment-dialog.component.scss'],
})
export class EnrollmentDialogComponent {
  enrollmentForm: FormGroup;
  courses: any[] = [];
  users: any[] = [];
  authUser: any;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<EnrollmentDialogComponent>,

    @Inject(MAT_DIALOG_DATA) private data: { enrollment: Enrollment, view: boolean, edit: boolean },
    private coursesService: CoursesService,
    private usersService: UsersService,
    private authService: AuthService) {
    this.enrollmentForm = this.fb.group({
      courseTitle: ['', [Validators.required]],
      studentName: ['', [Validators.required]],
      startDate: [{ value: '', disabled: true }, [Validators.required]],
      endDate: [{ value: '', disabled: true }, [Validators.required]],
      shift: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
      modality: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
      teacher: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
      magicWandCore: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
    });
    if (this.data.view) {
      this.enrollmentForm.patchValue(this.data.enrollment);
      this.enrollmentForm.get('courseTitle')?.disable();
      this.enrollmentForm.get('studentName')?.disable();
    } 
    if(this.data.edit) {
      this.enrollmentForm.patchValue(this.data.enrollment);
    }
  }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
    if (this.authService.authUser?.role === 'Student') {
      this.usersService.getStudents().subscribe(students => {
          this.users = students;
      });
    } else {
      this.usersService.getUsers().subscribe(users => {
          this.users = users.filter(user => user.role === 'Student');
      });
    }

    this.enrollmentForm?.get('courseTitle')?.valueChanges.subscribe(courseTitle => {
      const selectedCourse = this.courses.find(course => course.title === courseTitle);
      if (selectedCourse) {
        this.enrollmentForm?.get('startDate')?.setValue(selectedCourse.startDate);
        this.enrollmentForm?.get('endDate')?.setValue(selectedCourse.endDate);
        this.enrollmentForm?.get('shift')?.setValue(selectedCourse.shift);
        this.enrollmentForm?.get('modality')?.setValue(selectedCourse.modality);
        this.enrollmentForm?.get('teacher')?.setValue(selectedCourse.teacher);
      } else {
        this.enrollmentForm?.get('startDate')?.setValue(selectedCourse.startDate);
        this.enrollmentForm?.get('endDate')?.setValue(selectedCourse.endDate);
        this.enrollmentForm?.get('shift')?.setValue(selectedCourse.shift);
        this.enrollmentForm?.get('modality')?.setValue(selectedCourse.modality);
        this.enrollmentForm?.get('teacher')?.setValue(selectedCourse.teacher);
      }
    });
    this.enrollmentForm?.get('studentName')?.valueChanges.subscribe(studentName => {
      const selectedUser = this.users.find(user => (user.firstName + " " + user.lastName) === studentName);
      if (selectedUser) {
        this.enrollmentForm?.get('email')?.setValue(selectedUser.email);
        this.enrollmentForm?.get('magicWandCore')?.setValue(selectedUser.magicWandCore);
      } else {
        this.enrollmentForm?.get('email')?.setValue(selectedUser.email);
        this.enrollmentForm?.get('magicWandCore')?.setValue(selectedUser.magicWandCore);
      }
    });
  }

  save(): void {
    if (this.enrollmentForm.invalid) {
      this.markFormGroupTouched(this.enrollmentForm);
      this.showErrorMessage('Please fill in all fields correctly.');
      return;
    }
    this.enrollmentForm.get('startDate')?.enable();
    this.enrollmentForm.get('endDate')?.enable();
    this.enrollmentForm.get('shift')?.enable();
    this.enrollmentForm.get('modality')?.enable();
    this.enrollmentForm.get('teacher')?.enable();
    this.enrollmentForm.get('email')?.enable();
    this.enrollmentForm.get('magicWandCore')?.enable();

    this.matDialogRef.close(this.enrollmentForm.value);

    this.enrollmentForm.get('startDate')?.disable();
    this.enrollmentForm.get('endDate')?.disable();
    this.enrollmentForm.get('shift')?.disable();
    this.enrollmentForm.get('modality')?.disable();
    this.enrollmentForm.get('email')?.disable();
    this.enrollmentForm.get('modality')?.disable();
    this.enrollmentForm.get('magicWandCore')?.disable();
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
}
