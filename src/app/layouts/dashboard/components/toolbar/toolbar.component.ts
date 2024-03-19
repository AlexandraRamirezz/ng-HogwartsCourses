import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  userName: string | undefined;
  authUser: any;
  title: string = 'Home';

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {}
  ngOnInit():void {
    this.userName = this.authService.authUser?.firstName + " " + this.authService.authUser?.lastName;
    this.authUser = this.authService.authUser;
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      map(route => route.snapshot.data['title'])
    ).subscribe(title => {
      this.title = title;
    });
  }

  @Output()
  toggleSidebar = new EventEmitter();
}
