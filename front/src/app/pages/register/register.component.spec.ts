import { expect } from '@jest/globals';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmitForme', () => {
    component.userEmail = 'test@example.com';
    component.userName = 'Jean';

    const consoleSpy = spyOn(console, 'log');

    component.onSubmitForme();

    expect(consoleSpy).toHaveBeenCalledWith('test@example.com');
    expect(consoleSpy).toHaveBeenCalledWith('Bonjour : Jean');
  });
});

