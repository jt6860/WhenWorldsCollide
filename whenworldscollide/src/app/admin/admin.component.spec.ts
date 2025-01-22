import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { MenuEditingComponent } from '../menu-editing/menu-editing.component';
import { ContactSubmissionComponent } from '../contact-submission/contact-submission.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AuthResponseData} from '../auth.service'

// Mock AuthService
const mockAuthService = {
  isLoggedIn$: of(false),
  login: () => of({ message: 'Login successful', username: 'testuser' }), // Return an object with a 'message' property
  logout: () => {}
};

// Mock Router
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminComponent,
        FormsModule,
        CommonModule,
        MenuEditingComponent,
        ContactSubmissionComponent,
        OrderListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoggedIn).toBeFalse();
    expect(component.isLoginMode).toBeTrue();
    expect(component.errorMessage).toBe('');
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.activeSection).toBeNull();
  });

  it('should toggle login/registration mode', () => {
    component.onToggleMode();
    expect(component.isLoginMode).toBeFalse();
    component.onToggleMode();
    expect(component.isLoginMode).toBeTrue();
  });

  it('should set active section', () => {
    component.showSection('menu');
    expect(component.activeSection).toBe('menu');
    component.showSection('contacts');
    expect(component.activeSection).toBe('contacts');
    component.showSection('orders');
    expect(component.activeSection).toBe('orders');
  });

  it('should logout and navigate to home', () => {
    spyOn(authService, 'logout');
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.activeSection).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle successful login', fakeAsync(() => {
    const mockResponse: AuthResponseData = { message: 'Login successful', username: 'testuser' }; // Define the expected response object
    spyOn(authService, 'login').and.returnValue(of(mockResponse)); // Mock the login method to return the mockResponse
    const form = { valid: true, resetForm: () => {} } as NgForm;
    component.username = 'testuser';
    component.password = 'testpassword';
  
    component.onSubmit(form);
    tick();
  
    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    expect(component.errorMessage).toBe('');
  }));

  it('should handle login error', fakeAsync(() => {
    const error = { message: 'Login failed' };
    spyOn(authService, 'login').and.returnValue(throwError(() => error));
    const form = { valid: true, resetForm: () => {} } as NgForm;
    component.username = 'testuser';
    component.password = 'testpassword';
    component.onSubmit(form);
    tick();
    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpassword' });
    expect(component.errorMessage).toBe(error.message);
  }));

  it('should not submit invalid form', () => {
    spyOn(authService, 'login');
    const form = { valid: false, resetForm: () => {} } as NgForm;
    component.onSubmit(form);
    expect(authService.login).not.toHaveBeenCalled();
  });

});