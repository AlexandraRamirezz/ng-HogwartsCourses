import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { User } from './models/user';
import { EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  userName = '';

  users: User[] = [
    {
      id: 1,
      firstName: 'Diego',
      lastName: 'Defilippi',
      gender: 'Male',
      email: 'diego.defilippi@gmail.com',
      dateOfBirth: '10/02/2003',
      magicWandWood: 'Oak',
      magicWandCore: 'Phoenix feather',
      magicWandLength: 'Long',
    },
    {
      id: 2,
      firstName: 'Alexandra',
      lastName: 'Ramirez',
      gender: 'Female',
      email: 'alexandra.ramirez@gmail.com',
      dateOfBirth: '03/07/2004',
      magicWandWood: 'Cherry tree',
      magicWandCore: 'Unicorn hair',
      magicWandLength: 'Short',
    },
    {
      id: 3,
      firstName: 'Elena',
      lastName: 'García',
      gender: 'Female',
      email: 'elena.garcia@gmail.com',
      dateOfBirth: '05/15/1990',
      magicWandWood: 'Willow',
      magicWandCore: 'Unicorn hair',
      magicWandLength: 'Long',
    },
    {
      id: 4,
      firstName: 'Carlos',
      lastName: 'López',
      gender: 'Male',
      email: 'carlos.lopez@gmail.com',
      dateOfBirth: '12/30/1985',
      magicWandWood: 'Walnut',
      magicWandCore: "Dragon's heartstring",
      magicWandLength: 'Short',
    },  
    {
      id: 5,
      firstName: 'Isabella',
      lastName: 'Rodríguez',
      gender: 'Female',
      email: 'isabella.rodriguez@gmail.com',
      dateOfBirth: '08/21/2000',
      magicWandWood: 'Cherry tree',
      magicWandCore: 'Phoenix feather',
      magicWandLength: 'Medium',
    },
  ];

  constructor(private matDialog: MatDialog) { }

  openUserDialog(): void {
    this.matDialog
      .open(UserDialogComponent)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (!!v) {
            const maxId = Math.max(...this.users.map(user => user.id), 0);
            const newId = maxId + 1;

            this.users = [
              ...this.users,
              {
                ...v,
                id: newId,
              },
            ];
          }
        },
      });
  }

  onEditUser(user: User): void {
    this.matDialog
      .open(UserDialogComponent, {
        data: user,
      })
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (!!v) {
            this.users = this.users.map((u) =>
              u.id === user.id ? { ...u, ...v } : u
            );
          }
        },
      });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Do you want to delete the student permanently?')) {
      this.users = this.users.filter((u) => u.id !== userId);
    }
  }

  @Input()
  dataSource: User[] = [];

  @Output()
  deleteUser = new EventEmitter<number>();

  @Output()
  editUser = new EventEmitter<User>();

  displayedColumns = ['id', 'fullName', 'email', 'dateOfBirth', 'magicWandWood', 'magicWandCore','magicWandLength', 'actions'];
}
