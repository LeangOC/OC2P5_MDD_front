import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SubjectListItemComponent } from './subject-list-item.component';

describe('SubjectListItemComponent', () => {
  let component: SubjectListItemComponent;
  let fixture: ComponentFixture<SubjectListItemComponent>;

  const subjectMock = {
    id: 1,
    name: 'Angular',
    description: 'Framework frontend',
    followed: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectListItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(
      SubjectListItemComponent
    );

    component = fixture.componentInstance;

    component.subject = subjectMock as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive subject input', () => {
    expect(component.subject).toEqual(subjectMock);
  });

  it('should create subscribe event emitter', () => {
    expect(component.subscribeEvent).toBeDefined();
  });

  it('should emit subscribe event', () => {
    const emitSpy = jest.spyOn(
      component.subscribeEvent,
      'emit'
    );

    component.subscribeEvent.emit();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should display subscribe label when subject is not followed', () => {
    component.subject = {
      ...subjectMock,
      followed: false
    } as any;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain("S'abonner");
  });

  it('should display unsubscribe label when subject is followed', () => {
    component.subject = {
      ...subjectMock,
      followed: true
    } as any;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain('Se désabonner');
  });

  it('should emit event when button is clicked', () => {
    const emitSpy = jest.spyOn(
      component.subscribeEvent,
      'emit'
    );

    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
