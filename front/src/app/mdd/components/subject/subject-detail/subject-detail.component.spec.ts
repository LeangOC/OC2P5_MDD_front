import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError, firstValueFrom } from 'rxjs';

import { SubjectDetailComponent } from './subject-detail.component';
import { SubjectService } from 'src/app/core/services/subject.service';

describe('SubjectDetailComponent', () => {
  let component: SubjectDetailComponent;
  let fixture: ComponentFixture<SubjectDetailComponent>;

  let routerMock: {
    navigateByUrl: jest.Mock;
  };

  let subjectServiceMock: {
    getSubjectById: jest.Mock;
  };

  const subjectMock = {
    id: 1,
    name: 'Angular',
    description: 'Angular subject',
    followed: false
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    routerMock = {
      navigateByUrl: jest.fn()
    };

    subjectServiceMock = {
      getSubjectById: jest.fn().mockReturnValue(
        of(subjectMock)
      )
    };

    await TestBed.configureTestingModule({
      declarations: [SubjectDetailComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: SubjectService,
          useValue: subjectServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1')
              }
            }
          }
        }
      ]
    })
      .overrideComponent(SubjectDetailComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(
      SubjectDetailComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read subject id from route', () => {
    expect(component.subjectId)
      .toBe('1');
  });

  it('should load subject on init', async () => {
    const subject =
      await firstValueFrom(component.subject$);

    expect(subject)
      .toEqual(subjectMock);
  });

  it('should call subject service with route id', () => {
    expect(subjectServiceMock.getSubjectById)
      .toHaveBeenCalledWith('1');
  });

  it('should navigate back to subjects list', () => {
    component.goBack();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/subjects');
  });

  it('should expose observable subject$', () => {
    expect(component.subject$)
      .toBeDefined();
  });

  it('should set error message when service fails', async () => {
    subjectServiceMock.getSubjectById.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    const fixture =
      TestBed.createComponent(
        SubjectDetailComponent
      );

    const componentError =
      fixture.componentInstance;

    fixture.detectChanges();

    await expect(
      firstValueFrom(componentError.subject$)
    ).rejects.toThrow(
      'Error fetching subject'
    );

    expect(componentError.errorMessage)
      .toBe('Error fetching subject');
  });

  it('should log error when service fails', async () => {
    const consoleSpy =
      jest.spyOn(console, 'error');

    subjectServiceMock.getSubjectById.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    const fixture =
      TestBed.createComponent(
        SubjectDetailComponent
      );

    const componentError =
      fixture.componentInstance;

    fixture.detectChanges();

    try {
      await firstValueFrom(componentError.subject$);
    } catch {}

    expect(consoleSpy)
      .toHaveBeenCalled();
  });
});
