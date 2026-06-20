// npx jest src/app/core/components/header/header.component.spec.ts
import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest
} from '@jest/globals';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { HeaderType } from 'src/app/app.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const changeDetectorRefMock = {
    detectChanges: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: changeDetectorRefMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store header type input', () => {
    component.headerType = HeaderType.HomeHeader;

    expect(component.headerType)
      .toBe(HeaderType.HomeHeader);
  });

  it('should emit toggleSidenav event when menu is clicked', () => {
    const emitSpy = jest.spyOn(component.toggleSidenav, 'emit');

    component.onMenuClick();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

});
