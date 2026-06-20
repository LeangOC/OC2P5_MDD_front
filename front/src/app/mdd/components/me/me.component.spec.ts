// npx jest src/app/mdd/components/me/me.component.spec.ts
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
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { MeComponent } from './me.component';

import { AuthService } from 'src/app/core/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SubjectService } from 'src/app/core/services/subject.service';
import { SubscriptionService } from 'src/app/core/services/subscriptionService';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const currentUser = {
    id: 1,
    username: 'john',
    email: 'john@test.fr'
  };

  const subjectsMock = [
    {
      id: 1,
      name: 'Angular',
      followed: true
    },
    {
      id: 2,
      name: 'Spring',
      followed: false
    },
    {
      id: 3,
      name: 'Java',
      followed: true
    }
  ];

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  const sessionMock = {
    user: currentUser,
    logIn: jest.fn(),
    logOut: jest.fn()
  };

  const authMock = {
    updateUser: jest.fn(),
    getCurrentUser: jest.fn()
  };

  const subjectServiceMock = {
    getSubjects: jest.fn()
  };

  const subscriptionServiceMock = {
    subscribeToSubject: jest.fn(),
    unsubscribeSubject: jest.fn()
  };

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    subjectServiceMock.getSubjects.mockReturnValue(
      of(subjectsMock)
    );

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: SubjectService,
          useValue: subjectServiceMock
        },
        {
          provide: SubscriptionService,
          useValue: subscriptionServiceMock
        },
        {
          provide: SessionService,
          useValue: sessionMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: AuthService,
          useValue: authMock
        }
      ]
    })
      .overrideComponent(MeComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
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

  it('should initialize profile form', () => {
    expect(component.profileForm).toBeDefined();

    expect(component.profileForm.contains('username'))
      .toBe(true);

    expect(component.profileForm.contains('email'))
      .toBe(true);
  });

  it('should set current user on init', () => {
    expect(component.currentUser)
      .toEqual(currentUser);
  });

  it('should load followed subjects only', () => {
    component.getUnsubscribedSubjects();

    expect(component.subjects.length)
      .toBe(2);

    expect(component.subjects.every(
      s => s.followed
    )).toBe(true);
  });

  it('should handle success', () => {
    authMock.getCurrentUser.mockReturnValue(
      of(currentUser)
    );

    component.handleSuccess(
      'User updated successfully',
      'token123'
    );

    expect(localStorage.getItem('token'))
      .toBe('token123');

    expect(component.message)
      .toBe('User updated successfully');

    expect(sessionMock.logIn)
      .toHaveBeenCalledWith(currentUser);
  });

  it('should handle error', () => {
    component.handleError(
      'Failed to update user'
    );

    expect(component.errorMessage)
      .toBe('Failed to update user');
  });

  it('should update user profile', () => {
    authMock.updateUser.mockReturnValue(
      of({ token: 'token123' })
    );

    authMock.getCurrentUser.mockReturnValue(
      of(currentUser)
    );

    component.profileForm.patchValue({
      username: 'john',
      email: 'john@test.fr'
    });

    component.onSave();

    expect(authMock.updateUser)
      .toHaveBeenCalledWith(
        '1',
        {
          username: 'john',
          email: 'john@test.fr'
        }
      );
  });

  it('should not update profile when form is invalid', () => {
    component.profileForm.patchValue({
      username: '',
      email: ''
    });

    component.onSave();

    expect(authMock.updateUser)
      .not.toHaveBeenCalled();
  });

  it('should subscribe to subject', () => {
    const subject = {
      id: 10,
      followed: false
    };

    subscriptionServiceMock
      .subscribeToSubject
      .mockReturnValue(of({}));

    component.currentUser = currentUser as any;

    component.onSubscribeSubject(subject as any);

    expect(
      subscriptionServiceMock.subscribeToSubject
    ).toHaveBeenCalledWith(
      10,
      1
    );

    expect(subject.followed)
      .toBe(true);
  });

  it('should unsubscribe from subject', () => {
    const subject = {
      id: 10,
      followed: true
    };

    subscriptionServiceMock
      .unsubscribeSubject
      .mockReturnValue(of({}));

    component.currentUser = currentUser as any;

    component.onSubscribeSubject(subject as any);

    expect(
      subscriptionServiceMock.unsubscribeSubject
    ).toHaveBeenCalledWith(
      10,
      1
    );

    expect(subject.followed)
      .toBe(false);
  });

  it('should ignore undefined subject', () => {
    component.onSubscribeSubject(undefined as any);

    expect(
      subscriptionServiceMock.subscribeToSubject
    ).not.toHaveBeenCalled();

    expect(
      subscriptionServiceMock.unsubscribeSubject
    ).not.toHaveBeenCalled();
  });

  it('should logout and redirect', () => {
    component.onLogoutClick();

    expect(sessionMock.logOut)
      .toHaveBeenCalled();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/');
  });

  it('should handle update user error', () => {
    authMock.updateUser.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.profileForm.patchValue({
      username: 'john',
      email: 'john@test.fr'
    });

    component.onSave();

    expect(component.errorMessage)
      .toBe('Failed to update user');
  });


});
