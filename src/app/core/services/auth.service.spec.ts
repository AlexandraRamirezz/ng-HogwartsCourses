import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../../layouts/dashboard/pages/users/models/user';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

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
            "userId": 1,
            "firstName": "firstNameTest",
            "lastName": "lastNameTest",
            "gender": "Others",
            "email": "email.test@hogwarts.edu",
            "password": "test",
            "dateOfBirth": "09/19/1979",
            "magicWandCore": "Dragon heartstring",
            "role": "Student"
        };

        usersServiceSpy.getAuth.and.returnValue(of(mockUser));

        authService.login({ email: 'email.test@hogwarts.edu', password: 'password' });

        expect(authService.authUser).toEqual(mockUser);
        expect(authService.token).toBeTruthy();
    });

    it('Displays an error alert when credentials are incorrect', () => {
        // Configurando el servicio para devolver un observable de valor undefined,
        // simulando credenciales incorrectas
        usersServiceSpy.getAuth.and.returnValue(of(undefined));
    
        // Espiando la función fire de Swal
        spyOn(Swal, 'fire');
    
        // Llamando al método login con credenciales incorrectas
        authService.login({ email: 'email.test@hogwarts.edu', password: 'password' });
    
        // Verificando que authService.authUser sea null
        expect(authService.authUser).toBeNull();
    
        // Verificando que se haya llamado a Swal.fire con los argumentos correctos
        expect(Swal.fire).toHaveBeenCalled();
        const args = (Swal.fire as jasmine.Spy).calls.mostRecent().args[0]; 
        expect(args.icon).toBe('error');
        expect(args.title).toBe('Authentication failed');
        expect(args.text).toBe('Invalid username and/or password');
    });
    
});