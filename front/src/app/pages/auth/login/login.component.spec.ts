// npx jest src/app/pages/auth/login/login.component.spec.ts

import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  const sessionMock = {
    logIn: jest.fn()
  };

  const authMock = {
    login: jest.fn(),
    getCurrentUser: jest.fn()
  };

  const userMock = {
    id: 1,
    userName: 'john',
    email: 'john@test.fr'
  };

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: AuthService,
          useValue: authMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: SessionService,
          useValue: sessionMock
        }
      ]
    })
      .overrideComponent(LoginComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();

    expect(component.loginForm.contains('login')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should create invalid form when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should create valid form with valid values', () => {
    component.loginForm.patchValue({
      login: 'john@test.fr',
      password: 'Password1!'
    });

    expect(component.loginForm.valid).toBe(true);
  });

  it('should focus login field after view init', async () => {
    const focusMock = jest.fn();

    component.login = {
      nativeElement: {
        focus: focusMock
      }
    } as ElementRef;

    component.ngAfterViewInit();

    await Promise.resolve();

    expect(focusMock).toHaveBeenCalled();
  });

  it('should call auth service on submit', () => {
    authMock.login.mockReturnValue(
      of({ token: 'token123' })
    );

    authMock.getCurrentUser.mockReturnValue(
      of(userMock)
    );

    component.loginForm.patchValue({
      login: 'john@test.fr',
      password: 'Password1!'
    });

    component.submit();

    expect(authMock.login).toHaveBeenCalledWith({
      login: 'john@test.fr',
      password: 'Password1!'
    });
  });

  it('should handle successful login', () => {
    authMock.getCurrentUser.mockReturnValue(
      of(userMock)
    );

    component.handleSuccess(
      'User logged successfully',
      'token123'
    );

    expect(localStorage.getItem('token'))
      .toBe('token123');

    expect(component.message)
      .toBe('User logged successfully');

    expect(sessionMock.logIn)
      .toHaveBeenCalledWith(userMock);

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/article');
  });

  it('should handle login error', () => {
    component.handleError('Failed to log user');

    expect(component.errorMessage)
      .toBe('Failed to log user');
  });

  it('should set error message when login fails', () => {
    authMock.login.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.loginForm.patchValue({
      login: 'john@test.fr',
      password: 'Password1!'
    });

    component.submit();

    expect(component.errorMessage)
      .toBe('Failed to log user');
  });

});
