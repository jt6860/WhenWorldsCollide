import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that no unexpected requests are made
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.contactForm.value).toEqual({ name: '', email: '', message: '' });
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.contactForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message.'
    });
    expect(component.contactForm.valid).toBeTruthy();
  });

  it('should have an invalid form when name is missing', () => {
    component.contactForm.patchValue({ email: 'test@example.com', message: 'Test message' });
    expect(component.contactForm.valid).toBeFalsy();
    expect(component.contactForm.get('name')?.hasError('required')).toBeTruthy();
  });

  it('should have an invalid form when email is invalid', () => {
    component.contactForm.setValue({ name: 'Test User', email: 'invalid-email', message: 'Test message' });
    expect(component.contactForm.valid).toBeFalsy();
    expect(component.contactForm.get('email')?.hasError('email')).toBeTruthy();
  });

  it('should have an invalid form when message is missing', () => {
    component.contactForm.setValue({ name: 'Test User', email: 'test@example.com', message: '' });
    expect(component.contactForm.valid).toBeFalsy();
    expect(component.contactForm.get('message')?.hasError('required')).toBeTruthy();
  });

});