import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../../layouts/dashboard/pages/enrollments/models/enrollment';
import { Course } from '../../layouts/dashboard/pages/courses/models/course';

let courses: Course[] = [
  {
    courseId: 1,
    title: 'Potions 101',
    description: 'Learn potion-making basics, ingredients, and techniques. No prior experience needed. Open to all years.',
    startDate: '10/02/2022',
    endDate: '03/05/2003',
    shift: 'Evening shift',
    modality: 'Hybrid',
    teacher: 'Minerva McGonagall',
    capacity: 20,
    enrolled: 1,
    status: true,
  },
  {
    courseId: 2,
    title: 'Charms for Beginners',
    description: 'Introduction to charms and spells, focusing on wand technique and incantations. Suitable for first-years and above.',
    startDate: '05/20/2022',
    endDate: '12/08/2022',
    shift: 'Morning shift',
    modality: 'On-site',
    teacher: 'Diego Defilippi',
    capacity: 20,
    enrolled: 2,
    status: true,
  },
  {
    courseId: 3,
    title: 'Herbology Essentials',
    description: 'Explore magical properties of plants, cultivation, and practical applications in potions and healing.',
    startDate: '01/02/2024',
    endDate: '04/28/2024',
    shift: 'Afternoon shift',
    modality: 'Online',
    teacher: 'Severus Snape',
    capacity: 20,
    enrolled: 3,
    status: true,
  },
];

let enrollments: Enrollment[] = []

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  constructor() { }

  getCourses() {
    return of(courses);
}

  deleteCoursesByID(id: number){
    courses = courses.filter((el) => el.courseId != id);
    return this.getCourses();
  }

  deleteEnrollmentsByID(id:number){
    enrollments = enrollments.filter((el) => el.enrollmentId != id);
    return of(enrollments);
  }

  addCourses(data: Course) {
    courses = [...courses, { ...data, courseId: courses.length + 1, status: true, }];
    return this.getCourses();
  }

  updateCourses(id: number, data: Course){
    courses = courses.map((el) => el.courseId === id ? {...el,...data} : el);
    return this.getCourses();
  }

  checkStudents(dataC: Course, DataE: Enrollment[]): Observable<Enrollment[]> {
    return of(DataE.filter((el) => el.courseId === dataC.courseId));
  }

  checkCourses(dataS: User, DataE: Enrollment[]): Observable<Enrollment[]> {
    return of(DataE.filter((el) => el.courseId === dataS.userId));
  }
}
