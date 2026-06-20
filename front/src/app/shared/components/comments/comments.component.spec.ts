import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { CommentsComponent } from './comments.component';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  const commentsMock = [
    {
      id: 1,
      authorName: 'John',
      content: 'Premier commentaire',
      createdAt: new Date()
    },
    {
      id: 2,
      authorName: 'Jane',
      content: 'Deuxième commentaire',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      declarations: [CommentsComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    })
      .overrideComponent(CommentsComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;

    component.comments = commentsMock as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive comments input', () => {
    expect(component.comments)
      .toEqual(commentsMock);
  });

  it('should initialize comment control', () => {
    expect(component.commentCtrl)
      .toBeDefined();
  });

  it('should create invalid control when empty', () => {
    component.commentCtrl.setValue('');

    expect(component.commentCtrl.valid)
      .toBe(false);
  });

  it('should reject comment shorter than 10 characters', () => {
    component.commentCtrl.setValue('abc');

    expect(component.commentCtrl.valid)
      .toBe(false);

    expect(component.commentCtrl.errors?.['minlength'])
      .toBeDefined();
  });

  it('should accept valid comment', () => {
    component.commentCtrl.setValue(
      'Ceci est un commentaire valide'
    );

    expect(component.commentCtrl.valid)
      .toBe(true);
  });

  it('should reject comment longer than 1000 characters', () => {
    const longComment = 'a'.repeat(1001);

    component.commentCtrl.setValue(longComment);

    expect(component.commentCtrl.valid)
      .toBe(false);

    expect(component.commentCtrl.errors?.['maxlength'])
      .toBeDefined();
  });

  it('should emit new comment', () => {
    const emitSpy = jest.spyOn(
      component.newComment,
      'emit'
    );

    component.commentCtrl.setValue(
      'Ceci est un commentaire valide'
    );

    component.onLeaveComment();

    expect(emitSpy)
      .toHaveBeenCalledWith(
        'Ceci est un commentaire valide'
      );
  });

  it('should reset control after emitting comment', () => {
    component.commentCtrl.setValue(
      'Ceci est un commentaire valide'
    );

    component.onLeaveComment();

    expect(component.commentCtrl.value)
      .toBeNull();
  });

  it('should not emit invalid comment', () => {
    const emitSpy = jest.spyOn(
      component.newComment,
      'emit'
    );

    component.commentCtrl.setValue('abc');

    component.onLeaveComment();

    expect(emitSpy)
      .not.toHaveBeenCalled();
  });

  it('should not emit empty comment', () => {
    const emitSpy = jest.spyOn(
      component.newComment,
      'emit'
    );

    component.commentCtrl.setValue('');

    component.onLeaveComment();

    expect(emitSpy)
      .not.toHaveBeenCalled();
  });

  it('should create output emitter', () => {
    expect(component.newComment)
      .toBeDefined();
  });
});
