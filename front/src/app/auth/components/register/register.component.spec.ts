// npx jest src/app/auth/components/register/register.component.spec.ts
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

import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  const sessionMock = {
    logIn: jest.fn()
  };

  const authMock = {
    register: jest.fn(),
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
      declarations: [RegisterComponent],
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
      .overrideComponent(RegisterComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should initialize register form', () => {
    expect(component.registerForm).toBeDefined();

    expect(component.registerForm.contains('username'))
      .toBe(true);

    expect(component.registerForm.contains('email'))
      .toBe(true);

    expect(component.registerForm.contains('password'))
      .toBe(true);
  });

  it('should create invalid form when empty', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should create valid form with valid values', () => {
    component.registerForm.patchValue({
      username: 'john',
      email: 'john@test.fr',
      password: 'Password1!'
    });

    expect(component.registerForm.valid).toBe(true);
  });

  it('should focus username input after view init', async () => {
    const focusMock = jest.fn();

    component.usernameInput = {
      nativeElement: {
        focus: focusMock
      }
    } as ElementRef;

    component.ngAfterViewInit();

    await Promise.resolve();

    expect(focusMock).toHaveBeenCalled();
  });

  it('should call auth service on submit', () => {
    authMock.register.mockReturnValue(
      of({ token: 'token123' })
    );

    authMock.getCurrentUser.mockReturnValue(
      of(userMock)
    );

    component.registerForm.patchValue({
      username: 'john',
      email: 'john@test.fr',
      password: 'Password1!'
    });

    component.submit();

    expect(authMock.register)
      .toHaveBeenCalledWith({
        username: 'john',
        email: 'john@test.fr',
        password: 'Password1!'
      });
  });

  it('should handle successful registration', () => {
    authMock.getCurrentUser.mockReturnValue(
      of(userMock)
    );

    component.handleSuccess(
      'User created successfully',
      'token123'
    );

    expect(localStorage.getItem('token'))
      .toBe('token123');

    expect(component.message)
      .toBe('User created successfully');

    expect(sessionMock.logIn)
      .toHaveBeenCalledWith(userMock);

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/article');
  });

  it('should handle registration error', () => {
    component.handleError('Failed to create user');

    expect(component.errorMessage)
      .toBe('Failed to create user');
  });

  it('should set error message when registration fails', () => {
    authMock.register.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.registerForm.patchValue({
      username: 'john',
      email: 'john@test.fr',
      password: 'Password1!'
    });

    component.submit();

    expect(component.errorMessage)
      .toBe('Failed to create user');
  });

  it('should not call register service when form is invalid', () => {
    component.registerForm.patchValue({
      username: '',
      email: '',
      password: ''
    });

    component.submit();

    expect(authMock.register)
      .not.toHaveBeenCalled();
  });
});
