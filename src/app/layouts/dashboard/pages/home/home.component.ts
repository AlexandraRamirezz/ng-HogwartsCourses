import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import Chart from 'chart.js/auto';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';

import { registerables } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: any[] = [];
  rolesCount: { [key: string]: number } = {};
  wandCount: { [key: string]: number } = {};
  courses: any[] = [];
  enrollmentCount: { [key: string]: number } = {};
  enrollments: any[] = [];
  genderCount: { [key: string]: number } = {};

  constructor(private usersService: UsersService, private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.countUsersByRole();
      this.countWands();
      this.createChart();
      this.createChart2();
      this.countUsersByGender();
      this.createGenderChart();
    });

    this.coursesService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.countEnrollments();
      this.createChart3();
    });
  }

  countUsersByRole(): void {
    this.users.forEach(user => {
      const role = user.role;
      if (this.rolesCount[role]) {
        this.rolesCount[role]++;
      } else {
        this.rolesCount[role] = 1;
      }
    });
  }

  countWands(): void {
    this.users.forEach(user => {
      const wandType = user.magicWandCore;
      if (this.wandCount[wandType]) {
        this.wandCount[wandType]++;
      } else {
        this.wandCount[wandType] = 1;
      }
    });
  }

  createChart(): void {
    const ctx = document.getElementById('userChart') as HTMLCanvasElement;
    const userChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.rolesCount),
        datasets: [{
          label: 'Number of users per role',
          data: Object.values(this.rolesCount),
          backgroundColor: [
            '#CD6577',
            '#75B6AB',
            '#E1C17D'
          ],
          borderColor: [
            '#C45568',
            '#37B49E',
            '#FFDF9B',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createChart2(): void {
    const ctx = document.getElementById('wandChart') as HTMLCanvasElement;
    const wandChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.wandCount),
        datasets: [{
          label: 'Distribution of users by wand type',
          data: Object.values(this.wandCount),
          backgroundColor: [
            '#CD6577',
            '#75B6AB',
            '#847CC2',
            '#E1C17D',
          ],
          borderColor: [
            '#C45568',
            '#37B49E',
            '#7363E9',
            '#E1C17D',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  countEnrollments(): void {
    this.courses.forEach(course => {
      const courseTitle = course.title;
      const enrolled = course.enrolled;
      if (!this.enrollmentCount[courseTitle]) {
        this.enrollmentCount[courseTitle] = 0;
      }
      this.enrollmentCount[courseTitle] += enrolled;
    });
  }

  createChart3(): void {
    const ctx = document.getElementById('courseChart') as HTMLCanvasElement;
    const courseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.enrollmentCount),
        datasets: [{
          label: 'Number of students enrolled per course',
          data: Object.values(this.enrollmentCount),
          backgroundColor: '#847CC2',
          borderColor: '#7363E9',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  countUsersByGender(): void {
    this.users.forEach(user => {
      const gender = user.gender;
      if (this.genderCount[gender]) {
        this.genderCount[gender]++;
      } else {
        this.genderCount[gender] = 1;
      }
    });
  }
  
  createGenderChart(): void {
    const ctx = document.getElementById('genderChart') as HTMLCanvasElement;
    const genderChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.genderCount),
        datasets: [{
          label: 'Distribution of users by gender',
          data: Object.values(this.genderCount),
          backgroundColor: [
            '#E1C17D',
            '#75B6AB',
            '#CD6577',
          ],
          borderColor: [
            '#FFDF9B',
            '#37B49E',
            '#C45568',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}