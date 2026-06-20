import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { SubjectsComponent } from './subjects.component';
import { SubjectService } from 'src/app/core/services/subject.service';
import { SubscriptionService } from 'src/app/core/services/subscriptionService';
import { SessionService } from 'src/app/core/services/session.service';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;

  let subjectServiceMock: {
    getSubjects: jest.Mock;
    deleteSubject: jest.Mock;
  };

  let routerMock: {
    navigateByUrl: jest.Mock;
  };

  let subscriptionServiceMock: {
    subscribeToSubject: jest.Mock;
    unsubscribeSubject: jest.Mock;
  };

  let sessionServiceMock: {
    user: {
      id: number;
    };
  };

  const subjectsMock = [
    {
      id: 1,
      name: 'Angular',
      description: 'Angular description',
      followed: false
    },
    {
      id: 2,
      name: 'Java',
      description: 'Java description',
      followed: true
    }
  ];

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    subjectServiceMock = {
      getSubjects: jest.fn().mockReturnValue(of(subjectsMock)),
      deleteSubject: jest.fn().mockReturnValue(of('deleted'))
    };

    routerMock = {
      navigateByUrl: jest.fn()
    };

    subscriptionServiceMock = {
      subscribeToSubject: jest.fn().mockReturnValue(of({})),
      unsubscribeSubject: jest.fn().mockReturnValue(of({}))
    };

    sessionServiceMock = {
      user: {
        id: 99
      }
    };

    await TestBed.configureTestingModule({
      declarations: [SubjectsComponent],
      providers: [
        {
          provide: SubjectService,
          useValue: subjectServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: SubscriptionService,
          useValue: subscriptionServiceMock
        },
        {
          provide: SessionService,
          useValue: sessionServiceMock
        }
      ]
    })
      .overrideComponent(SubjectsComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load subjects on init', () => {
    expect(subjectServiceMock.getSubjects)
      .toHaveBeenCalled();

    expect(component.subjects)
      .toEqual(subjectsMock);
  });

  it('should populate subjects list', () => {
    component.getSubjects();

    expect(component.subjects.length)
      .toBe(2);
  });

  it('should set error message when getSubjects fails', () => {
    subjectServiceMock.getSubjects.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    component.getSubjects();

    expect(component.errorMessage)
      .toBe('Error fetching subjects');
  });

  it('should delete subject and reload list', () => {
    const getSubjectsSpy = jest.spyOn(
      component,
      'getSubjects'
    );

    component.onDeleteSubject('1');

    expect(subjectServiceMock.deleteSubject)
      .toHaveBeenCalledWith('1');

    expect(getSubjectsSpy)
      .toHaveBeenCalled();
  });

  it('should set error message when delete fails', () => {
    subjectServiceMock.deleteSubject.mockReturnValue(
      throwError(() => new Error('Delete error'))
    );

    component.onDeleteSubject('1');

    expect(component.errorMessage)
      .toBe('Error deleting subject');
  });

  it('should navigate to subject detail', () => {
    component.onSubjectDetail(5);

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/subjects/5');
  });

  it('should navigate to add subject form', () => {
    component.onAddSubjectForm();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/subjects/subject-form');
  });

  it('should navigate to edit subject form', () => {
    component.onEditSubject('10');

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/subjects/subject-form/10');
  });

  it('should subscribe to subject', () => {
    const subject = {
      id: 1,
      name: 'Angular',
      followed: false
    } as any;

    component.onSubscribeSubject(subject);

    expect(
      subscriptionServiceMock.subscribeToSubject
    ).toHaveBeenCalledWith(
      1,
      99
    );

    expect(subject.followed)
      .toBe(true);
  });

  it('should unsubscribe from subject', () => {
    const subject = {
      id: 2,
      name: 'Java',
      followed: true
    } as any;

    component.onSubscribeSubject(subject);

    expect(
      subscriptionServiceMock.unsubscribeSubject
    ).toHaveBeenCalledWith(
      2,
      99
    );

    expect(subject.followed)
      .toBe(false);
  });

  it('should do nothing when subject is null', () => {
    component.onSubscribeSubject(null as any);

    expect(
      subscriptionServiceMock.subscribeToSubject
    ).not.toHaveBeenCalled();

    expect(
      subscriptionServiceMock.unsubscribeSubject
    ).not.toHaveBeenCalled();
  });

});
