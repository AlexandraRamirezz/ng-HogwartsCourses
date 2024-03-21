import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {
    let authService: AuthService;
    let usersServiceSpy: jasmine.SpyObj<UsersService>;

    beforeEach(() => {
        const usersServiceSpyObj = jasmine.createSpyObj('UsersService', ['getAuth']);

        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersServiceSpyObj }
            ]
        });

        authService = TestBed.inject(AuthService);
        usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    });

    it('AuthService is defined', () => {
        expect(authService).toBeTruthy();
    });

    it('A user is authenticated to authUser when I log in', () => {
        const mockUser: User = {
            "id": "user001",
            "firstName": "firstNameTest",
            "lastName": "lastNameTest",
            "gender": "Others",
            "email": "email.test@hogwarts.edu",
            "password": "passwordTest",
            "dateOfBirth": "09/19/1979",
            "magicWandCore": "Dragon heartstring",
            "role": "Student",
            "userId": 1
        };
        usersServiceSpy.getAuth.and.returnValue(of(mockUser));
        authService.login({ email: 'email.test@hogwarts.edu', password: 'password' });

        expect(authService.authUser).toEqual(mockUser);
        expect(authService.token).toBeTruthy();
    });

    it('Log out successfully', () => {
        authService.authUser = {
            "id": "t4xp",
            "firstName": "firstNameTest",
            "lastName": "lastNameTest",
            "gender": "Others",
            "email": "email.test@hogwarts.edu",
            "password": "passwordTest",
            "dateOfBirth": "09/19/1979",
            "magicWandCore": "Dragon heartstring",
            "role": "Student",
            "userId": 1
        };
        authService.token = 'mockToken';
        spyOn(localStorage, 'removeItem');
        authService.logout();

        expect(authService.token).toBe('');
        expect(localStorage.removeItem).toHaveBeenCalledWith('authUser');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('Verify the token correctly', () => {
        localStorage.setItem('token', 'mockToken');

        authService.verifyToken().subscribe(isValid => {
            expect(isValid).toBeTruthy();
        });
    });

    it('Handles the authenticated session when launching the app', () => {
        const storedUser = {
            "id": "t4xp",
            "firstName": "firstNameTest",
            "lastName": "lastNameTest",
            "gender": "Others",
            "email": "email.test@hogwarts.edu",
            "password": "passwordTest",
            "dateOfBirth": "09/19/1979",
            "magicWandCore": "Dragon heartstring",
            "role": "Student",
            "userId": 1,
        };
        localStorage.setItem('authUser', JSON.stringify(storedUser));

        authService = new AuthService(TestBed.inject(Router), TestBed.inject(UsersService));

        expect(authService.authUser).toEqual(storedUser);
    });
});