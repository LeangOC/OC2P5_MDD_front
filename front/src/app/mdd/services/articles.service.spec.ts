import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { throwError } from 'rxjs';

import { ArticlesService } from './articles.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { SessionService } from 'src/app/core/services/session.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpMock: HttpTestingController;

  const errorHandlingServiceMock = {
    handleError: jest.fn((error) => throwError(() => error)),
  };

  const sessionServiceMock = {
    user: {
      id: 1,
      username: 'test',
      email: 'test@test.fr',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ArticlesService,
        {
          provide: ErrorHandlingService,
          useValue: errorHandlingServiceMock,
        },
        {
          provide: SessionService,
          useValue: sessionServiceMock,
        },
      ],
    });

    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get articles', () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Article 1',
        content: 'Content 1',
      },
      {
        id: 2,
        title: 'Article 2',
        content: 'Content 2',
      },
    ];

    service.getArticles().subscribe((articles) => {
      expect(articles).toEqual(mockArticles);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/article`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockArticles);
  });

  it('should get article by id', () => {
    const mockArticle = {
      id: 1,
      title: 'Article',
      content: 'Content',
      comments: [],
    };

    service.getArticleById('1').subscribe((article) => {
      expect(article).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/article/1`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockArticle);
  });

  it('should create comment successfully', () => {
    service
      .addNewComment({
        comment: 'Mon commentaire',
        articleId: 12,
      })
      .subscribe((result) => {
        expect(result).toBe(
          'Comment created successfully'
        );
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/comment`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      userId: 1,
      authorName: null,
      articleId: 12,
      content: 'Mon commentaire',
      createdAt: null,
    });

    req.flush({
      message: 'New Comment created',
    });
  });

  it('should fail when comment creation response is unexpected', (done) => {
    service
      .addNewComment({
        comment: 'Commentaire',
        articleId: 10,
      })
      .subscribe({
        next: () => {
          throw new Error('Should throw error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/comment`
    );

    req.flush({
      message: 'UNKNOWN',
    });
  });

  it('should call error handler when comment creation fails', (done) => {
    service
      .addNewComment({
        comment: 'Commentaire',
        articleId: 10,
      })
      .subscribe({
        error: () => {
          expect(
            errorHandlingServiceMock.handleError
          ).toHaveBeenCalled();
          done();
        },
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/comment`
    );

    req.error(new ProgressEvent('error'));
  });

  it('should create article successfully', () => {
    const payload = {
      userId: '1',
      subjectId: '2',
      title: 'Titre',
      content: 'Contenu',
    };

    service.createArticle(payload).subscribe((result) => {
      expect(result).toBe(
        'Article created successfully'
      );
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/article`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(payload);

    req.flush('New Article created');
  });

  it('should fail when article creation response is unexpected', (done) => {
    service
      .createArticle({
        userId: '1',
        subjectId: '2',
        title: 'Titre',
        content: 'Contenu',
      })
      .subscribe({
        next: () => {
          throw new Error('Should throw error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/article`
    );

    req.flush('UNKNOWN');
  });

  it('should call error handler when article creation fails', (done) => {
    service
      .createArticle({
        userId: '1',
        subjectId: '2',
        title: 'Titre',
        content: 'Contenu',
      })
      .subscribe({
        error: () => {
          expect(
            errorHandlingServiceMock.handleError
          ).toHaveBeenCalled();
          done();
        },
      });

    const req = httpMock.expectOne(
      `${service.baseUrl}/article`
    );

    req.error(new ProgressEvent('error'));
  });
});
