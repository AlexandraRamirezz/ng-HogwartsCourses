import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { User } from './models/user';
import { UsersService } from '../../../../core/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  style = 'bolder';

  displayedColumns: string[] = ['userId', 'fullName', 'gender', 'email', 'dateOfBirth', 'role', 'magicWandWood', 'magicWandCore','magicWandLength', 'actions'];
  
  users: User[] = [];

  constructor(private matDialog: MatDialog,private usersService: UsersService) {
    this.usersService.getUsers().subscribe({
      next: (user) => {
        this.users = user;
      }
    })
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
              next: (us) => {
                this.users = us;
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
          this.usersService.updateUsers(user.userId, result).subscribe({
            next: (us) => (this.users = us),
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

  onDeleteUser(userId: number) {
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
        this.usersService.deleteUsersByID(userId).subscribe({
          next: (us) => {
            this.users = us;
            Swal.fire({
              icon: 'success',
              title: 'User successfully deleted',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (error) => {
            console.error('Error deleting user: ', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the user.'
            });
          }
        });
      }
    });
  }
}
