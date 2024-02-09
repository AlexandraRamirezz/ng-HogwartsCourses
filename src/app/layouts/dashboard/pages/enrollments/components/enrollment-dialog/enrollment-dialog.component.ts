import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enrollment } from '../../models/enrollment';
import { CoursesService } from '../../../../../../core/courses.service';
import { UsersService } from '../../../../../../core/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enrollment-dialog',
  templateUrl: './enrollment-dialog.component.html',
  styleUrls: ['./enrollment-dialog.component.scss'],
})
export class EnrollmentDialogComponent {
  enrollmentForm: FormGroup;
  courses: any[] = []; 
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<EnrollmentDialogComponent>,

    @Inject(MAT_DIALOG_DATA) private data: { enrollment: Enrollment, view: boolean, edit: boolean },
    private coursesService: CoursesService,
    private usersService: UsersService,
    ){
    this.enrollmentForm = this.fb.group({
      courseTitle: ['', [Validators.required]],
      studentName: ['', [Validators.required]],
      shift: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
      modality: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$')]],
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

    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    })

    this.enrollmentForm?.get('courseTitle')?.valueChanges.subscribe(courseTitle => {
      const selectedCourse = this.courses.find(course => course.title === courseTitle);
      if (selectedCourse) {
        this.enrollmentForm?.get('shift')?.setValue(selectedCourse.shift);
        this.enrollmentForm?.get('modality')?.setValue(selectedCourse.modality);
      } else {
        this.enrollmentForm?.get('shift')?.setValue('');
        this.enrollmentForm?.get('modality')?.setValue('');
      }
    });
  }

  save(): void {
    if (this.enrollmentForm.invalid) {
      this.markFormGroupTouched(this.enrollmentForm);
      this.showErrorMessage('Please fill in all fields correctly.');
      return;
    }
    this.enrollmentForm.get('shift')?.enable();
    this.enrollmentForm.get('modality')?.enable();

    this.matDialogRef.close(this.enrollmentForm.value);

    this.enrollmentForm.get('shift')?.disable();
    this.enrollmentForm.get('modality')?.disable();
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
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
