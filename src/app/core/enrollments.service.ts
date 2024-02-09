import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../layouts/dashboard/pages/enrollments/models/enrollment';
import { UsersService } from './users.service';
import { Course } from '../layouts/dashboard/pages/courses/models/course';
import { CoursesService } from "./courses.service";

let enrollm: Enrollment[] = [
  {
    enrollmentId: 1,
    courseId: 2,
    courseTitle: 'Charms for Beginners',
    studentId: 4,
    studentName: 'Harry Potter',
    shift: 'Morning shift',
    modality: 'On-site',
  },
  {
    enrollmentId: 2,
    courseId: 2,
    courseTitle: 'Potions 101',
    studentId: 2,
    studentName: 'Alexandra Ramirez',
    shift: 'Evening shift',
    modality: 'Hybrid',
  },
  {
    enrollmentId: 3,
    courseId: 2,
    courseTitle: 'Charms for Beginners',
    studentId: 7,
    studentName: 'Hermione Granger',
    shift: 'Morning shift',
    modality: 'On-site',
  },
  {
    enrollmentId: 4,
    courseId: 3,
    courseTitle: 'Herbology Essentials',
    studentId: 10,
    studentName: 'Draco Malfoy',
    shift: 'Afternoon shift',
    modality: 'Online',
  },
];

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  constructor(private usersService: UsersService, private coursesService: CoursesService) {}

  getEnrollments(){
      return of(enrollm);
  }

  deleteEnrollmentsByID(id: number){
    enrollm = enrollm.filter((el) => el.enrollmentId != id);
      return this.getEnrollments();
  }

  addEnrollments(data: Enrollment, dataS: User[], dataC: Course[]){
      let student: User | undefined = this.getStudent(data.studentName, dataS);
      let course: Course | undefined = this.getCourse(data.courseTitle, dataC);

      if (student) {
          data.studentId = student.userId;
          if(course){
              data.courseId = course.courseId;
              enrollm = [...enrollm, {...data, enrollmentId: enrollm.length + 1}];
          }
      }
      return this.getEnrollments();
  }

  updateEnrollments(id: number, data: Enrollment, dataC: Course[]){
      let course: Course | undefined = this.getCourse(data.courseTitle, dataC);
  
      enrollm = enrollm.map((el) => {
          if (el.enrollmentId === id) {
              return { ...el, ...data, courseId: course ? course.courseId : el.courseId };
          } else {
              return el;
          }
      });
      return this.getEnrollments();
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
