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

import { ArticleListItemComponent } from './article-list-item.component';

describe('ArticleListItemComponent', () => {
  let component: ArticleListItemComponent;
  let fixture: ComponentFixture<ArticleListItemComponent>;

  const routerMock = {
    navigate: jest.fn()
  };

  const articleMock = {
    id: 123,
    title: 'Mon article',
    content: 'Contenu de test',
    userName: 'John',
    publishedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleListItemComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    })
      .overrideComponent(ArticleListItemComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(
      ArticleListItemComponent
    );

    component = fixture.componentInstance;

    component.article = articleMock as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive article input', () => {
    expect(component.article).toEqual(articleMock);
  });

  it('should navigate to article details', () => {
    component.showArticleDetails();

    expect(routerMock.navigate)
      .toHaveBeenCalledWith([
        'mdd/article/article-detail/',
        123
      ]);
  });

  it('should navigate using current article id', () => {
    component.article = {
      ...articleMock,
      id: 999
    } as any;

    component.showArticleDetails();

    expect(routerMock.navigate)
      .toHaveBeenCalledWith([
        'mdd/article/article-detail/',
        999
      ]);
  });
});
