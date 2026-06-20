import {
  describe,
  beforeEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register page', () => {
    component.onSignUp();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/auth/register');
  });

  it('should navigate to login page', () => {
    component.onSignIn();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/auth/login');
  });
});
