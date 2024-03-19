import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  userName: string | undefined;
  authUser: any;

  constructor(private router: Router, private authService: AuthService) {}
    ngOnInit():void {
      this.userName = this.authService.authUser?.firstName + " " + this.authService.authUser?.lastName;
      this.authUser = this.authService.authUser;
    }

    logout(): void{
      this.router.navigate(['auth', 'login'])
    }
}
