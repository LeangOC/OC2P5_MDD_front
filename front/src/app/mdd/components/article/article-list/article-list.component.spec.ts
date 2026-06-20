// npx jest src/app/mdd/components/article/article-list/article-list.component.spec.ts
import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';

import { ArticleListComponent } from './article-list.component';

describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;

  const mockArticles = [
    {
      id: 2,
      title: 'B Article',
      content: 'Content B',
      publishedAt: '2024-02-01'
    },
    {
      id: 1,
      title: 'A Article',
      content: 'Content A',
      publishedAt: '2024-01-01'
    }
  ];

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  const activatedRouteMock = {
    data: of({
      articles: [...mockArticles]
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleListComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }
      ]
    })
      .overrideComponent(ArticleListComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles from route data on init', async () => {
    component.ngOnInit();

    const articles = await firstValueFrom(component.articles$);

    expect(articles).toEqual(mockArticles);
  });

  it('should navigate to article creation page', () => {
    component.CreateArticle();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/article/article-form');
  });

  it('should sort articles by title', async () => {
    component.ngOnInit();

    component.sortArticles('title');

    const articles = await firstValueFrom(component.articles$);

    expect(articles[0].title).toBe('A Article');
    expect(articles[1].title).toBe('B Article');
  });

  it('should sort articles by publishedAt', async () => {
    component.ngOnInit();

    component.sortArticles('publishedAt');

    const articles = await firstValueFrom(component.articles$);

    expect(articles[0].publishedAt).toBe('2024-01-01');
    expect(articles[1].publishedAt).toBe('2024-02-01');
  });


});
