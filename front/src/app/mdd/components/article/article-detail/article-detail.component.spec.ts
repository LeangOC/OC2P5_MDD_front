//  npx jest src/app/mdd/components/article/article-detail/article-detail.component.spec.ts
import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ArticleDetailComponent } from './article-detail.component';
import { ArticlesService } from 'src/app/mdd/services/articles.service';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;

  const articleMock = {
    id: 1,
    title: 'Article test',
    content: 'Contenu',
    comments: [],
    userName: 'John',
    subjectName: 'Angular',
    publishedAt: new Date()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  const articlesServiceMock = {
    getArticleById: jest.fn(),
    addNewComment: jest.fn()
  };

  beforeEach(async () => {
    articlesServiceMock.getArticleById.mockReturnValue(
      of(articleMock)
    );

    await TestBed.configureTestingModule({
      declarations: [ArticleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        },
        {
          provide: ArticlesService,
          useValue: articlesServiceMock
        }
      ]
    })
      .overrideComponent(ArticleDetailComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load article on init', () => {
    component.ngOnInit();

    expect(
      articlesServiceMock.getArticleById
    ).toHaveBeenCalledWith('1');
  });

  it('should set articleId from route', () => {
    component.ngOnInit();

    expect(component.articleId).toBe('1');
  });

  it('should handle success message', () => {
    component.handleSuccess('OK');

    expect(component.message).toBe('OK');
  });

  it('should handle error message', () => {
    component.handleError('ERROR');

    expect(component.errorMessage).toBe('ERROR');
  });

  it('should forward new comment', () => {
    const spy = jest
      .spyOn(component,'onArticleCommented')
      .mockImplementation(() => {});


    component.articleId = '1';
    component.handleNewComment('Mon commentaire');

    expect(spy).toHaveBeenCalledWith({
      comment: 'Mon commentaire',
      articleId: 1
    });
  });

  it('should create comment and reload article', () => {
    articlesServiceMock.addNewComment.mockReturnValue(
      of('success')
    );

    const reloadSpy = jest.spyOn(
      articlesServiceMock,
      'getArticleById'
    );

    component.articleId = '1';

    component.onArticleCommented({
      comment: 'test',
      articleId: 1
    });

    expect(
      articlesServiceMock.addNewComment
    ).toHaveBeenCalled();

    expect(component.message)
      .toBe('Comment created successfully');

    expect(reloadSpy).toHaveBeenCalledWith('1');
  });

  it('should handle comment creation error', () => {
    articlesServiceMock.addNewComment.mockReturnValue(
      throwError(() => new Error('error'))
    );

    component.articleId = '1';

    component.onArticleCommented({
      comment: 'test',
      articleId: 1
    });

    expect(component.errorMessage)
      .toBe('Failed to create Comment');
  });

  it('should not load article when route id is null', () => {
    activatedRouteMock.snapshot.paramMap.get
      .mockReturnValueOnce(null);

    const consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    component.ngOnInit();

    expect(consoleSpy)
      .toHaveBeenCalledWith('articleId is null');
  });
});
