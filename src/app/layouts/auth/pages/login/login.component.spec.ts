import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../../../core/services/auth.service";
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from '../../auth-routing.module';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { SharedModule } from "../../../../shared/shared.module";

describe('LoginComponent', () => {
    let component: LoginComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [MockProvider(AuthService)],
            imports: [
                CommonModule,
                AuthRoutingModule,
                SharedModule,
                ReactiveFormsModule,
            ],
        })
        component = TestBed.createComponent(LoginComponent).componentInstance;
    });

    it('The LoginComponent is successfully instantiated', () => {
        expect(component).toBeTruthy()
    });

    it('Email and password should be required', () => {
        expect(component.loginForm.get('email')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.loginForm.get('password')?.hasValidator(Validators.required)).toBeTrue();
    });

    it('Invalid form test with fields in touched', () => {
        const spyOnMarkAllAsTouched = spyOn(component.loginForm,'markAllAsTouched');
        component.loginForm.patchValue({
            email: '',
            password: '',
        });
        expect(component.loginForm.invalid).toBeTrue();
        component.onSubmit();
        expect(spyOnMarkAllAsTouched).toHaveBeenCalled();
    });

    it('Proof of valid form with filled fields', () => {
        component.loginForm.patchValue({
            email: 'email.test@hogwarts.edu',
            password: 'passwordTest',
        });
        expect(component.loginForm.valid).toBeTrue();
    });

    it('You should initialize the login form with empty fields', () => {
        const controlEmail = component.loginForm.get('email');
        const controlPassword = component.loginForm.get('password');

        expect(controlEmail?.value).toBe('');
        expect(controlPassword?.value).toBe('');
    });

    it('Proof of successful form submission', () => {
        const authService = TestBed.inject(AuthService);
        const spyOnLogin = spyOn(authService, 'login');
        component.loginForm.patchValue({
            email: 'email.test@hogwarts.edu',
            password: 'passwordTest',
        });
        component.onSubmit();
        expect(spyOnLogin).toHaveBeenCalledWith({ email: 'email.test@hogwarts.edu', password: 'passwordTest' });
    });
})
