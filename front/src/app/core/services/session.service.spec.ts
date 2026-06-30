import {
  describe,
  beforeEach,
  it,
  expect,
  jest,
} from '@jest/globals';

import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(SessionService);

    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged out by default', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should login user', () => {
    const user = {
      id: 1,
      username: 'john',
      email: 'john@test.fr',
    };

    service.logIn(user as any);

    expect(service.isLogged).toBe(true);
    expect(service.user).toEqual(user);
  });


  it('should logout user', () => {
    localStorage.setItem('token', 'jwt-token');

    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should emit logout state when logging out', () => {
    const nextSpy = jest.fn();

    (service as any).isLoggedSubject.subscribe(nextSpy);

    service.logOut();

    expect(nextSpy).toHaveBeenCalledWith(false);
  });

  it('should switch from login to logout', () => {
    const user = {
      id: 1,
      username: 'john',
      email: 'john@test.fr',
    };

    service.logIn(user as any);

    expect(service.isLogged).toBe(true);

    service.logOut();

    expect(service.isLogged).toBe(false);
  });

  it('should remove token from localStorage on logout', () => {
    localStorage.setItem('token', 'abc123');

    service.logOut();

    expect(localStorage.getItem('token')).toBeNull();
  });
});

