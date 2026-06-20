import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect
} from '@jest/globals';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { SubjectService } from './subject.service';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../../environments/environment';

describe('SubjectService', () => {
  let service: SubjectService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.baseUrl;

  const subjectMock = {
    id: 1,
    name: 'Angular',
    description: 'Angular description',
    followed: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubjectService,
        ErrorHandlingService
      ]
    });

    service = TestBed.inject(SubjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all subjects', () => {
    service.getSubjects().subscribe((subjects) => {
      expect(subjects.length).toBe(1);
      expect(subjects[0]).toEqual(subjectMock);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/subject`
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush([subjectMock]);
  });

  it('should get subject by id', () => {
    service.getSubjectById('1')
      .subscribe((subject) => {
        expect(subject)
          .toEqual(subjectMock);
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject/1`
    );

    expect(req.request.method)
      .toBe('GET');

    req.flush(subjectMock);
  });

  it('should add subject successfully', () => {
    service
      .addSubject({
        name: 'Spring'
      })
      .subscribe((message) => {
        expect(message)
          .toBe('Subject created successfully');
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject`
    );

    expect(req.request.method)
      .toBe('POST');

    req.flush('New Subject created');
  });

  it('should fail when add subject returns unexpected response', (done) => {
    service
      .addSubject({
        name: 'Spring'
      })
      .subscribe({
        next: () => {
          fail();
        },
        error: (error) => {
          expect(error)
            .toBeTruthy();
          done();
        }
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject`
    );

    req.flush('unexpected response');
  });

  it('should delete subject', () => {
    service.deleteSubject('1')
      .subscribe((response) => {
        expect(response)
          .toBe('deleted');
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject/1`
    );

    expect(req.request.method)
      .toBe('DELETE');

    req.flush('deleted');
  });

  it('should update subject successfully', () => {
    service
      .updateSubject(
        '1',
        { name: 'Updated Angular' }
      )
      .subscribe((message) => {
        expect(message)
          .toBe('Subject updated successfully');
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject/1`
    );

    expect(req.request.method)
      .toBe('PUT');

    req.flush('Subject updated');
  });

  it('should fail when update subject returns unexpected response', (done) => {
    service
      .updateSubject(
        '1',
        { name: 'Updated Angular' }
      )
      .subscribe({
        next: () => {
          fail();
        },
        error: (error) => {
          expect(error)
            .toBeTruthy();
          done();
        }
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject/1`
    );

    req.flush('bad response');
  });

  it('should handle getSubjects http error', (done) => {
    service.getSubjects().subscribe({
      next: () => {
        fail();
      },
      error: () => {
        expect(true)
          .toBe(true);
        done();
      }
    });

    const req = httpMock.expectOne(
      `${baseUrl}/subject`
    );

    req.flush(
      'Server Error',
      {
        status: 500,
        statusText: 'Server Error'
      }
    );
  });

  it('should handle getSubjectById http error', (done) => {
    service.getSubjectById('1')
      .subscribe({
        next: () => {
          fail();
        },
        error: () => {
          expect(true)
            .toBe(true);
          done();
        }
      });

    const req = httpMock.expectOne(
      `${baseUrl}/subject/1`
    );

    req.flush(
      'Server Error',
      {
        status: 500,
        statusText: 'Server Error'
      }
    );
  });

  it('should expose configured baseUrl', () => {
    expect(service.baseUrl)
      .toBe(environment.baseUrl);
  });
});
