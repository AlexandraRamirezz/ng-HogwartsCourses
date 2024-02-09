import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../../layouts/dashboard/pages/enrollments/models/enrollment';

let users: User[] = [
  {
    userId: 1,
    firstName: 'Diego',
    lastName: 'Defilippi',
    gender: 'Male',
    email: 'diego.defilippi@hogwarts.edu',
    dateOfBirth: '10/02/2003',
    magicWandWood: 'Oak',
    magicWandCore: 'Phoenix feather',
    magicWandLength: 'Long',
    role: 'Teacher',
  },
  {
    userId: 2,
    firstName: 'Alexandra',
    lastName: 'Ramirez',
    gender: 'Female',
    email: 'alexandra.ramirez@hogwarts.edu',
    dateOfBirth: '03/07/2004',
    magicWandWood: 'Cherry tree',
    magicWandCore: 'Unicorn hair',
    magicWandLength: 'Short',
    role: 'Student',
  },
  {
    userId: 3,
    firstName: 'Elena',
    lastName: 'García',
    gender: 'Female',
    email: 'elena.garcia@hogwarts.edu',
    dateOfBirth: '05/15/1990',
    magicWandWood: 'Willow',
    magicWandCore: 'Unicorn hair',
    magicWandLength: 'Long',
    role: 'Administrator',
  },
  {
    userId: 4,
    firstName: 'Harry',
    lastName: 'Potter',
    gender: 'Male',
    email: 'harry.potter@hogwarts.edu',
    dateOfBirth: '07/31/1980',
    magicWandWood: 'Walnut',
    magicWandCore: "Phoenix feather",
    magicWandLength: 'Medium',
    role: 'Student',
  },  
  {
    userId: 5,
    firstName: 'Isabella',
    lastName: 'Rodríguez',
    gender: 'Others',
    email: 'isabella.rodriguez@hogwarts.edu',
    dateOfBirth: '08/21/2000',
    magicWandWood: 'Cherry tree',
    magicWandCore: 'Phoenix feather',
    magicWandLength: 'Medium',
    role: 'Student',
  },
  {
    userId: 6,
    firstName: 'Severus',
    lastName: 'Snape',
    gender: 'Male',
    email: 'severus.snape@hogwarts.edu',
    dateOfBirth: '09/01/1960',
    magicWandWood: 'Walnut',
    magicWandCore: 'Phoenix feather',
    magicWandLength: 'Long',
    role: 'Teacher',
  },
  {
    userId: 7,
    firstName: 'Hermione',
    lastName: 'Granger',
    gender: 'Female',
    email: 'hermione.granger@hogwarts.edu',
    dateOfBirth: '09/19/1979',
    magicWandWood: 'Oak',
    magicWandCore: 'Dragon heartstring',
    magicWandLength: 'Short',
    role: 'Student',
  },
  {
    userId: 8,
    firstName: 'Ronald',
    lastName: 'Weasley',
    gender: 'Male',
    email: 'ronald.weasley@hogwarts.edu',
    dateOfBirth: '03/01/1980',
    magicWandWood: 'Willow',
    magicWandCore: 'Unicorn hair',
    magicWandLength: 'Medium',
    role: 'Administrator',
    },
    {
    userId: 9,
    firstName: 'Minerva',
    lastName: 'McGonagall',
    gender: 'Female',
    email: 'minerva.mcgonagall@hogwarts.edu',
    dateOfBirth: '10/04/1925',
    magicWandWood: 'Oak',
    magicWandCore: 'Dragon heartstring',
    magicWandLength: 'Short',
    role: 'Teacher',
  },
  {
    userId: 10,
    firstName: 'Draco',
    lastName: 'Malfoy',
    gender: 'Male',
    email: 'draco.malfoy@hogwarts.edu',
    dateOfBirth: '06/05/1980',
    magicWandWood: 'Walnut',
    magicWandCore: 'Unicorn hair',
    magicWandLength: 'Long',
    role: 'Student',
  },
];

let enrollments: Enrollment[] = []

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor() { }

  getUsers(){
    return of(users);
  }

  deleteUsersByID(id: number){
    users = users.filter((el) => el.userId != id);
    return this.getUsers();
  }

  deleteEnrollmentsByID(id: number){
    enrollments = enrollments.filter((el) => el.enrollmentId != id);
    return of(enrollments);
  }

  addUsers(data: User){
    users = [...users, {...data, userId: users.length + 1}];
    return this.getUsers();
  }

  updateUsers(id: number, data: User){
    users = users.map((el) => el.userId === id ? {...el,...data} : el);
    return this.getUsers();
  }

  checkCourses(dataS: User, DataE: Enrollment[]): Observable<Enrollment[]> {
      return of(DataE.filter((el) => el.studentId === dataS.userId));
  }
}
