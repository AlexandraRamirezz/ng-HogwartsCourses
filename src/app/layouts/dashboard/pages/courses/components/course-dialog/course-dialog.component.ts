import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course';
import { CoursesService } from '../../../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../../../core/services/enrollments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {
  courseForm: FormGroup;
  enrollments: any[] = [];
  enrollmentsStudent: any[] = [];
  viewMode: boolean;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<CourseDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { course: Course, view: boolean, edit: boolean },
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService) {
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
    if(this.data.view){
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
    this.getCourses();
  }
  
  getCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (courses: Course[]) => {
        this.enrollmentsService.getEnrollments().subscribe({
          next: (enrollments: any[]) => {
            this.enrollments = enrollments;
            const currentCourse = courses.find(course => course.courseId === this.data.course.courseId);
            if (currentCourse) {
              this.coursesService.checkStudents(currentCourse, enrollments).subscribe({
                next: (enrollmentsStudent: any[]) => {
                  this.enrollmentsStudent = enrollments.filter(enrollment => enrollment.courseId === currentCourse.courseId);
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

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enrollmentsService.deleteEnrollmentsByID(id).subscribe({
          next: () => {
            this.getCourses();
            Swal.fire({
              icon: 'success',
              title: 'Successful discharge',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (error) => {
            console.error('Error deleting enrollment: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the enrollment.'
            });
          }
        });
      }
    });
  }
}