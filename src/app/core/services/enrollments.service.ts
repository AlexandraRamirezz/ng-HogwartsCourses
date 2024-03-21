import { Injectable } from '@angular/core';
import { Observable, mergeMap, of } from 'rxjs';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../../layouts/dashboard/pages/enrollments/models/enrollment';
import { Course } from '../../layouts/dashboard/pages/courses/models/course';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

let enrollments: Enrollment[] = [];

@Injectable({
    providedIn: 'root'
})
export class EnrollmentsService {
    constructor(private httpClient: HttpClient) { }

    getEnrollments() {
        return this.httpClient.get<Enrollment[]>(`${environment.apiURL}enrollments`);
    }

    deleteEnrollmentsByID(id: string) {
        return this.httpClient.delete(`${environment.apiURL}enrollments/${id}`)
            .pipe(mergeMap(() => this.getEnrollments()));
    }

    addEnrollments(data: Enrollment, dataS: User[], dataC: Course[]) {
        let student: User | undefined = this.getStudent(data.studentName, dataS);
        let course: Course | undefined = this.getCourse(data.courseTitle, dataC);

        if (student) {
            data.studentId = student.userId;
            if (course) {
                data.courseId = course.courseId;
                return this.httpClient.
                    post<Enrollment>(`${environment.apiURL}enrollments`, data)
                    .pipe(mergeMap(() => this.getEnrollments()));
            }
        }
        return this.getEnrollments();
    }

    updateEnrollments(id: string, data: Enrollment, dataC: Course[]): Observable<Enrollment[]> {
        let course: Course | undefined = this.getCourse(data.courseTitle, dataC);

        enrollments = enrollments.map((el) => {
            if (el.id === id) {
                return { ...el, ...data, courseId: course ? course.courseId : el.courseId };
            } else {
                return el;
            }
        });
        return this.httpClient.put<Enrollment>(`${environment.apiURL}enrollments/${id}`, data)
            .pipe(
                mergeMap(() => this.getEnrollments())
            );
    }

    getStudent(fullName: string, dataS: User[]): User | undefined {
        const student = dataS.find(student => `${student.firstName} ${student.lastName}` === fullName);
        return student;
    }

    getCourse(courseTitle: string, dataS: Course[]): Course | undefined {
        const course = dataS.find(course => course.title === courseTitle);
        return course;
    }
}
