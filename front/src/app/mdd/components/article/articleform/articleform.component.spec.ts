import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ArticleformComponent } from './articleform.component';

import { ArticlesService } from '../../../services/articles.service';
import { SubjectService } from 'src/app/core/services/subject.service';
import { SessionService } from 'src/app/core/services/session.service';
import { Router } from '@angular/router';

describe('ArticleformComponent', () => {
  let component: ArticleformComponent;
  let fixture: ComponentFixture<ArticleformComponent>;

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  const articlesServiceMock = {
    createArticle: jest.fn()
  };

  const subjectServiceMock = {
    getSubjects: jest.fn()
  };

  const sessionServiceMock = {
    user: {
      id: 42
    }
  };

  const subjectsMock = [
    {
      id: 1,
      name: 'Angular'
    },
    {
      id: 2,
      name: 'Spring'
    }
  ];

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    subjectServiceMock.getSubjects.mockReturnValue(
      of(subjectsMock)
    );

    await TestBed.configureTestingModule({
      declarations: [ArticleformComponent],
      providers: [
        {
          provide: ArticlesService,
          useValue: articlesServiceMock
        },
        {
          provide: SubjectService,
          useValue: subjectServiceMock
        },
        {
          provide: SessionService,
          useValue: sessionServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    })
      .overrideComponent(ArticleformComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(
      ArticleformComponent
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

  it('should load subjects on init', () => {
    component.ngOnInit();

    expect(subjectServiceMock.getSubjects)
      .toHaveBeenCalled();

    expect(component.themes)
      .toEqual(subjectsMock);
  });

  it('should handle subject loading error', () => {
    subjectServiceMock.getSubjects.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.ngOnInit();

    expect(subjectServiceMock.getSubjects)
      .toHaveBeenCalled();
  });

  it('should handle success', () => {
    component.handleSuccess(
      'Article created successfully'
    );

    expect(component.message)
      .toBe('Article created successfully');

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/article');
  });

  it('should handle error', () => {
    component.handleError(
      'Failed to create Article'
    );

    expect(component.errorMessage)
      .toBe('Failed to create Article');
  });

  it('should create article when form is valid', () => {
    articlesServiceMock.createArticle.mockReturnValue(
      of({})
    );

    const formMock = {
      valid: true,
      value: {
        theme: 1,
        title: 'Titre',
        content: 'Contenu'
      }
    } as NgForm;

    component.onCreateArticle(formMock);

    expect(
      articlesServiceMock.createArticle
    ).toHaveBeenCalledWith({
      userId: '42',
      subjectId: 1,
      title: 'Titre',
      content: 'Contenu'
    });
  });

  it('should display success message after article creation', () => {
    articlesServiceMock.createArticle.mockReturnValue(
      of({})
    );

    const formMock = {
      valid: true,
      value: {
        theme: 1,
        title: 'Titre',
        content: 'Contenu'
      }
    } as NgForm;

    component.onCreateArticle(formMock);

    expect(component.message)
      .toBe('Article created successfully');
  });

  it('should display error message when article creation fails', () => {
    articlesServiceMock.createArticle.mockReturnValue(
      throwError(() => new Error('error'))
    );

    const formMock = {
      valid: true,
      value: {
        theme: 1,
        title: 'Titre',
        content: 'Contenu'
      }
    } as NgForm;

    component.onCreateArticle(formMock);

    expect(component.errorMessage)
      .toBe('Failed to create Article');
  });

  it('should not create article when form is invalid', () => {
    const formMock = {
      valid: false
    } as NgForm;

    component.onCreateArticle(formMock);

    expect(
      articlesServiceMock.createArticle
    ).not.toHaveBeenCalled();
  });
});
