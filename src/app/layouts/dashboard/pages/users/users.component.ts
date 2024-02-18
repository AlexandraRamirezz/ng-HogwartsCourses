import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { User } from './models/user';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  style = 'bolder';

  displayedColumns: string[] = ['userId', 'fullName', 'gender', 'email', 'dateOfBirth', 'magicWandCore', 'role', 'actions'];

  users: User[] = [];
  authUser: any;

  constructor(private matDialog: MatDialog, private usersService: UsersService, private authService: AuthService) {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        if (this.authUser && this.authUser.role === 'Administrator') {
          this.users = users;
        } else if (this.authUser && this.authUser.role === 'Teacher') {
          this.users = users.filter(user => user.role === 'Student' || user.role === 'Teacher');
        } else if (this.authUser && this.authUser.role === 'Student') {
          this.users = users.filter(user => user.role === 'Student');
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'The database is currently inaccessible.',
          confirmButtonColor: '#ef5350',
          background: '#303030',
          color: '#d0cccc',
        });
      },
    });
  }

  ngOnInit(): void {
    this.authUser = this.authService.authUser;
  }

  onCreateUser(): void {
    this.matDialog
      .open(UserDialogComponent, {
        data: { view: false, edit: false }
      }).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            const maxId = Math.max(...this.users.map(user => user.userId), 0);
            const newId = maxId + 1;
            const newUser = {
              ...result,
              userId: newId,
            };
            this.usersService.addUsers(newUser).subscribe({
              next: (users) => {
                this.users = users;
              },
            });
          }
        }
      });
  }

  onEditUser(user: User) {
    this.matDialog
      .open(UserDialogComponent, {
        data: { user: user, view: false, edit: true }
      }).afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.usersService.updateUsers(user.id, result).subscribe({
              next: (users) => (this.users = users),
            })
          }
        }
      })
  }

  onViewUser(user: User) {
    this.matDialog
      .open(UserDialogComponent, {
        data: { user: user, view: true, edit: false }
      })
  }

  onDeleteUser(data: User) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be reversed',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffe0b2',
      cancelButtonColor: '#ef5350',
      confirmButtonText: '<span style="color:black;">Yes, delete</span>',
      cancelButtonText: 'Cancel',
      background: '#303030',
      color: '#d0cccc',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUsersByID(data.id).subscribe({
          next: (users) => {
            this.users = users;
            Swal.fire({
              icon: 'success',
              text: 'User successfully deleted',
              showConfirmButton: false,
              timer: 2000,
              background: '#303030',
              color: '#d0cccc',
            });
          },
          error: (error) => {
            console.error('Error deleting user: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the user.',
              confirmButtonColor: '#ef5350',
              background: '#303030',
              color: '#d0cccc',
            });
          }
        });
      }
    });
  }
}
