import { TestBed } from "@angular/core/testing";
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UsersComponent } from "./users.component";
import { MockProvider } from 'ng-mocks';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from "rxjs";
import { UsersRoutingModule } from "./users-routing.module";
import { SharedModule } from "../../../../shared/shared.module";
import { CommonModule } from "@angular/common";

describe('Tests feature module | users / Students', () => {
    let component: UsersComponent;
    let mockUsersService: jasmine.SpyObj<UsersService>;
    let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<UserDialogComponent>>;

    beforeEach(async () => {
        mockUsersService = jasmine.createSpyObj('UsersService', ['getUsers']);
        mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        mockMatDialogRef.afterClosed = jasmine.createSpy().and.returnValue(of({}));

        await TestBed.configureTestingModule({
            declarations: [UsersComponent],
            providers: [
                MockProvider(UsersService, {
                    getUsers: () => of([
                        {
                            "id": "user001",
                            "userId": 1,
                            "firstName": "firstNameTest",
                            "lastName": "lastNameTest",
                            "gender": "Others",
                            "email": "email.test@hogwarts.edu",
                            "password": "test",
                            "dateOfBirth": "09/19/1979",
                            "magicWandCore": "Dragon heartstring",
                            "role": "Student"
                        }
                    ])
                }),
                MockProvider(MatDialog, {
                    open: () => mockMatDialogRef
                }),
                MockProvider(AuthService),
            ],
            imports: [
                CommonModule,
                UsersRoutingModule,
                SharedModule,
            ]
        }).compileComponents();
        component = TestBed.createComponent(UsersComponent).componentInstance;
    });

    it('The component is created successfully', () => {
        expect(component).toBeTruthy();
    });

    it('The users table', () => {
        expect(component.displayedColumns).toContain('userId');
        expect(component.displayedColumns).toContain('firstName');
        expect(component.displayedColumns).toContain('lasttName');
        expect(component.displayedColumns).toContain('gender');
        expect(component.displayedColumns).toContain('email');
        expect(component.displayedColumns).toContain('dateOfBirth');
        expect(component.displayedColumns).toContain('magicWandCore');
        expect(component.displayedColumns).toContain('role');
    });

    it('When creating a new user, the form must be opened', () => {
        mockMatDialogRef.afterClosed.and.returnValue(of({}));
        component.onCreateUser();
        expect(mockMatDialogRef.afterClosed).toHaveBeenCalled();
    });
});
