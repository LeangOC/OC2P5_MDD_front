import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from '@jest/globals';

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { ErrorHandlingService } from './error-handling.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const errorHandlingServiceMock = {
    handleError: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: ErrorHandlingService,
          useValue: errorHandlingServiceMock,
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should register user', () => {
    const payload = {
      name: 'john',
    };

    const response = {
      token: 'jwt-token',
    };

    service.register(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/auth/register`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(response);
  });

  it('should login user', () => {
    const payload = {
      name: 'john',
    };

    const response = {
      token: 'jwt-token',
    };

    service.login(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/auth/login`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(response);
  });

  it('should get current user', () => {
    const user = {
      id: 1,
      username: 'john',
      email: 'john@test.fr',
    };

    service.getCurrentUser().subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/user/me`
    );

    expect(req.request.method).toBe('GET');

    req.flush(user);
  });

  it('should update user', () => {
    const payload = {
      name: 'john updated',
    };

    const response = {
      token: 'new-token',
    };

    service
      .updateUser('1', payload)
      .subscribe((result) => {
        expect(result).toEqual(response);
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/user/1`
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush(response);
  });
});
