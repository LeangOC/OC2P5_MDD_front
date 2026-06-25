import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, interval, observable } from 'rxjs';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'front';

  headerType!: HeaderType;
  HeaderTypeEnum = HeaderType;

  showHeader = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const activeComponent = this.getActiveComponent(this.activatedRoute);
        if (activeComponent === HomeComponent) {
          this.headerType = HeaderType.HomeHeader;
        } else if (
          activeComponent === LoginComponent ||
          activeComponent === RegisterComponent
        ) {
          // check if the component is the login component or the regi
          this.headerType = HeaderType.LoginHeader;
        } else {
          this.headerType = HeaderType.MddHeader;
        }
      });
  }


  getActiveComponent(route: ActivatedRoute): any {
    if (route.routeConfig && route.routeConfig.component) {
      return route.routeConfig.component;
    } else if (route.firstChild) {
      return this.getActiveComponent(route.firstChild);
    }
    return null;
  }
}

export enum HeaderType {
  HomeHeader,
  LoginHeader,
  MddHeader,
}
