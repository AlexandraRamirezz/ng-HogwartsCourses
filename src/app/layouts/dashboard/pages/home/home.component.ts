import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import Chart from 'chart.js/auto';
import { CoursesService } from '../../../../core/services/courses.service';
import { EnrollmentsService } from '../../../../core/services/enrollments.service';
import { registerables } from 'chart.js/auto';
import { AuthService } from '../../../../core/services/auth.service';

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
  enrollments: any[] = [];
  genderCount: { [key: string]: number } = {};
  authUser: any;

  constructor(private usersService: UsersService, private coursesService: CoursesService, private authService: AuthService) { }
  ngOnInit(): void {
    this.authUser = this.authService.authUser;
    
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.countUsersByRole();
      this.countWands();
      this.createChart();
      this.createChart2();
      this.countUsersByGender();
      this.createGenderChart();
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
            '#EF5350',
            '#FFE0B2',
            '#FBBB6D'
          ],
          borderColor: [
            '#CD3734',
            '#CFAB76',
            '#CD9045',
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
            '#EF5350',
            '#FFE0B2',
            '#F4E98C',
            '#FBBB6D',
          ],
          borderColor: [
            '#CD3734',
            '#CFAB76',
            '#E6D85F',
            '#CD9045',
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
            '#FBBB6D',
            '#FFE0B2',
            '#EF5350',
          ],
          borderColor: [
            '#CD9045',
            '#CFAB76',
            '#CD3734',
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