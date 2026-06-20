// npx jest src/app/core/components/navigation-items/navigation-items.component.spec.ts
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
import { Router } from '@angular/router';

import { NavigationItemsComponent } from './navigation-items.component';

describe('NavigationItemsComponent', () => {
  let component: NavigationItemsComponent;
  let fixture: ComponentFixture<NavigationItemsComponent>;

  const routerMock = {
    navigateByUrl: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationItemsComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationItemsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to user profile page', () => {
    component.naviguerVersUserInfo();

    expect(routerMock.navigateByUrl)
      .toHaveBeenCalledWith('/mdd/me');
  });
});
