import { Injectable } from '@angular/core';
import { Observable, mergeMap, of } from 'rxjs';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../../layouts/dashboard/pages/enrollments/models/enrollment';
import { CreateCourse, Course } from '../../layouts/dashboard/pages/courses/models/course';
import { HttpClient } from '@angular/common/http';
import { EnrollmentsService } from './enrollments.service';
import { environment } from '../../../environments/environment';

let courses: Course[] = [];

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor(private httpClient: HttpClient, private enrollmentsService: EnrollmentsService) { }

  getCourses() {
    return this.httpClient.get<Course[]>(`${environment.apiURL}courses`);
  }

  deleteEnrollmentsByID(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}enrollments/${id}`)
      .pipe(mergeMap(() => this.enrollmentsService.getEnrollments())
      );
  }

  deleteCoursesByID(id: string) {
    return this.httpClient.delete(`${environment.apiURL}courses/${id}`)
  }

  addCourses(data: CreateCourse) {
    return this.httpClient
      .post<Course>(`${environment.apiURL}courses`, data)
  }

  updateCourses(id: string, data: Course) {
    courses = courses.map((el) => el.id === id ? { ...el, ...data } : el);
    return this.httpClient.put<Course>(`${environment.apiURL}courses/${id}`, data)
  }

  checkStudents(dataC: Course, DataE: Enrollment[]): Observable<Enrollment[]> {
    return of(DataE.filter((el) => el.courseId === dataC.courseId));
  }

  checkCourses(dataS: User, DataE: Enrollment[]): Observable<Enrollment[]> {
    return of(DataE.filter((el) => el.studentId === dataS.userId));
  }
}
