import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthResponseData } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully', () => {
    const authData = { username: 'testuser', password: 'testpassword' };
    const mockResponse: AuthResponseData = { message: 'Login successful', username: 'testuser' };

    service.login(authData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service['isLoggedInSubject'].value).toBe(true);
      expect(service['currentUserSubject'].value).toBe('testuser');
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const authData = { username: 'testuser', password: 'wrongpassword' };
    const mockError = new HttpErrorResponse({
      error: { message: 'Invalid username or password.' },
      status: 401
    });

    service.login(authData).subscribe({
      next: () => fail('Login should have failed'),
      error: (error: Error) => {
        expect(error.message).toBe('Invalid username or password.');
      }
    });

    const req = httpTestingController.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockError.error, { status: mockError.status, statusText: 'Unauthorized' });
  });

  it('should log out successfully', () => {
    service.logout();

    expect(service['isLoggedInSubject'].value).toBe(false);
    expect(service['currentUserSubject'].value).toBeNull();
    expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
    expect(sessionStorage.getItem('currentUser')).toBeNull();
  });

  it('should retrieve stored login status from session storage', () => {
    sessionStorage.setItem('isLoggedIn', JSON.stringify(true));

    const isLoggedIn = service['getStoredLoginStatus']();

    expect(isLoggedIn).toBe(true);
  });

  it('should retrieve stored user from session storage', () => {
    sessionStorage.setItem('currentUser', JSON.stringify('testuser'));

    const currentUser = service['getStoredUser']();

    expect(currentUser).toBe('testuser');
  });
});