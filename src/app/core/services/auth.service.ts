import { Injectable } from "@angular/core";
import { User } from "../../layouts/dashboard/pages/users/models/user";
import { UsersService } from "./users.service";
import { Router } from "@angular/router";
import { delay, map, of } from "rxjs";
import Swal from "sweetalert2";

interface LoginData {
    email: null | string;
    password: null | string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authUser: User | null = null;
    token: string = '';

    constructor(private router: Router, private usersService: UsersService) {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            this.authUser = JSON.parse(storedUser);
        }
    }

    login(data: LoginData): void {
        if (data.email && data.password) {
            this.usersService.getAuth(data.email, data.password)
                .subscribe(user => {
                    if (user) {
                        this.authUser = user;
                        this.token = this.generateToken();
                        localStorage.setItem('authUser', JSON.stringify(this.authUser));
                        localStorage.setItem('token', this.token);
                        this.router.navigate(['dashboard']);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Authentication Failed',
                            text: 'Invalid username and/or password',
                        });
                    }
                });
        }
    }

    logout(): void {
        this.authUser = null;
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        this.router.navigate(['auth', 'login']);
    }

    generateToken(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let token = "";

        for (let i = 0; i < 10; i++) {
            token += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return token;
    }

    verifyToken() {
        return of(localStorage.getItem('token')).pipe(delay(1000), map((res) => !!res));
    }

    setAuthUser(user: User): void {
        this.authUser = user;
        localStorage.setItem('authUser', JSON.stringify(this.authUser));
    }
}