// npx jest src/app/app.component.spec.ts
import {
  describe,
  beforeEach,
  it,
  expect,
  jest,
} from '@jest/globals';

import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subject } from 'rxjs';

import {
  AppComponent,
  HeaderType,
} from './app.component';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

@Component({
  template: '',
  standalone: false,
})
class DummyComponent {}

describe('AppComponent', () => {
  let component: AppComponent;

  let routerEvents$: Subject<any>;

  let routerMock: {
    events: Subject<any>;
  };

  let activatedRouteMock: any;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    routerMock = {
      events: routerEvents$,
    };

    activatedRouteMock = {};

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title front', () => {
    expect(component.title).toBe('front');
  });

  it('should return component from routeConfig', () => {
    const route = {
      routeConfig: {
        component: HomeComponent,
      },
    } as any;

    expect(component.getActiveComponent(route))
      .toBe(HomeComponent);
  });

  it('should return component from child route', () => {
    const route = {
      firstChild: {
        routeConfig: {
          component: LoginComponent,
        },
      },
    } as any;

    expect(component.getActiveComponent(route))
      .toBe(LoginComponent);
  });

  it('should return null when no component exists', () => {
    expect(
      component.getActiveComponent({} as ActivatedRoute)
    ).toBeNull();
  });

  it('should set HomeHeader for HomeComponent', () => {
    jest
      .spyOn(component, 'getActiveComponent')
      .mockReturnValue(HomeComponent);

    component.ngOnInit();

    routerEvents$.next(
      new NavigationEnd(1, '/', '/')
    );

    expect(component.headerType)
      .toBe(HeaderType.HomeHeader);
  });

  it('should set LoginHeader for LoginComponent', () => {
    jest
      .spyOn(component, 'getActiveComponent')
      .mockReturnValue(LoginComponent);

    component.ngOnInit();

    routerEvents$.next(
      new NavigationEnd(1, '/', '/')
    );

    expect(component.headerType)
      .toBe(HeaderType.LoginHeader);
  });

  it('should set LoginHeader for RegisterComponent', () => {
    jest
      .spyOn(component, 'getActiveComponent')
      .mockReturnValue(RegisterComponent);

    component.ngOnInit();

    routerEvents$.next(
      new NavigationEnd(1, '/', '/')
    );

    expect(component.headerType)
      .toBe(HeaderType.LoginHeader);
  });

  it('should set MddHeader for other component', () => {
    jest
      .spyOn(component, 'getActiveComponent')
      .mockReturnValue(DummyComponent);

    component.ngOnInit();

    routerEvents$.next(
      new NavigationEnd(1, '/', '/')
    );

    expect(component.headerType)
      .toBe(HeaderType.MddHeader);
  });

  it('should ignore non NavigationEnd events', () => {
    jest
      .spyOn(component, 'getActiveComponent')
      .mockReturnValue(HomeComponent);

    component.ngOnInit();

    routerEvents$.next({});

    expect(component.headerType)
      .toBeUndefined();
  });
});
