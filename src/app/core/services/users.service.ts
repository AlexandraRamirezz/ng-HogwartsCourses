import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, of } from 'rxjs';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { Enrollment } from '../../layouts/dashboard/pages/enrollments/models/enrollment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }

  getUsers() {
    return this.httpClient.get<User[]>(`${environment.apiURL}users`);
  }

  getStudents() {
    return this.httpClient.get<User[]>(`${environment.apiURL}users`)
    .pipe(map(users => users.filter(user => user.role === 'Student')));
  }

  getTeachers() {
    return this.httpClient.get<User[]>(`${environment.apiURL}users`)
    .pipe(map(users => users.filter(user => user.role === 'Teacher')));
  }

  deleteUsersByID(id: string) {
    return this.httpClient.delete(`${environment.apiURL}users/${id}`)
    .pipe(mergeMap(() => this.getUsers()));
  }

  deleteCoursesByID(id: string) {
    return this.httpClient.delete(`${environment.apiURL}courses/${id}`)
    .pipe(mergeMap(() => this.getUsers()));
  }

  addUsers(data: User) {
    return this.httpClient
    .post<User>(`${environment.apiURL}users`, data)
    .pipe(mergeMap(() => this.getUsers()));
}

  updateUsers(id: string, data: User): Observable<User[]> {
    return this.httpClient.put<User[]>(`${environment.apiURL}users/${id}`, data)
    .pipe(mergeMap(() => this.getUsers()));
  }

  checkCourses(dataS: User, DataE: Enrollment[]): Observable<Enrollment[]> {
    return of(DataE.filter((el) => el.studentId === dataS.userId));
  }

  getAuth(email: string, password: string): Observable<User | undefined> {
    return this.httpClient.get<User[]>(`${environment.apiURL}users`)
    .pipe(map(user => user.find(u => u.email === email && u.password === password)));
  }
}
