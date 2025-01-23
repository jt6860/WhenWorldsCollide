import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interface to define the structure of the authentication response data
export interface AuthResponseData {
  message: string;
  username?: string; // Optional username (might not be present in all responses)
}

// Interface to define the structure of the authentication data (username and password)
interface AuthData {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' }) // Marks the service as injectable at the root level
export class AuthService {
  // BehaviorSubject to hold and emit the current username
  private currentUserSubject = new BehaviorSubject<string | null>(this.getStoredUser());
  // Observable to expose the current username to other components
  currentUser$ = this.currentUserSubject.asObservable();

  // BehaviorSubject to hold and emit the current login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  // Observable to expose the login status to other components
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Base URL for authentication API endpoints
  private apiUrl = 'http://localhost:3000/api';

  // Constructor with HttpClient injection
  constructor(private http: HttpClient) { }

  // Method to handle user login
  login(authData: AuthData): Observable<AuthResponseData> {
    // Send a POST request to the /login endpoint with the authentication data
    return this.http.post<AuthResponseData>(`${this.apiUrl}/login`, authData).pipe(
      // Use tap operator to perform side effects on successful login
      tap(responseData => {
        // Set the login status to true
        this.setLoginStatus(true);
        // Set the current user based on the response (if username is present)
        this.setCurrentUser(responseData.username || null);
      }),
      // Use catchError operator to handle login errors
      catchError(this.handleError)
    );
  }

  // Method to handle user logout
  logout() {
    // Set the login status to false
    this.isLoggedInSubject.next(false);
    // Clear the current user
    this.currentUserSubject.next(null);
    // Remove login status and current user from session storage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
  }

  // Private method to set the login status in the service and session storage
  private setLoginStatus(status: boolean) {
    this.isLoggedInSubject.next(status);
    sessionStorage.setItem('isLoggedIn', JSON.stringify(status));
  }

  // Private method to get the stored login status from session storage
  private getStoredLoginStatus(): boolean {
    try {
      // Try to get the login status from session storage
      const storedLogin = sessionStorage.getItem('isLoggedIn');
      // Parse the stored value (if it exists) or return false if it doesn't
      return storedLogin ? JSON.parse(storedLogin) : false;
    } catch (error) {
      // Log an error if there's an issue parsing the stored value
      console.error('Error parsing stored login status:', error);
      // Remove the invalid item from session storage
      sessionStorage.removeItem('isLoggedIn');
      // Return false as a default value
      return false;
    }
  }

  // Private method to set the current user in the service and session storage
  private setCurrentUser(username: string | null) {
    this.currentUserSubject.next(username);
    sessionStorage.setItem('currentUser', JSON.stringify(username));
  }

  // Private method to get the stored current user from session storage
  private getStoredUser(): string | null {
    try {
      // Try to get the current user from session storage
      const storedUser = sessionStorage.getItem('currentUser');
      // Parse the stored value (if it exists) or return null if it doesn't
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      // Log an error if there's an issue parsing the stored value
      console.error('Error parsing stored user:', error);
      // Remove the invalid item from session storage
      sessionStorage.removeItem('currentUser');
      // Return null as a default value
      return null;
    }
  }

  // Private method to handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    // Default error message
    let errorMessage = 'An unknown error occurred!';
    // If the error has a response body and a message, use a switch statement to handle specific error cases
    if (error.error && error.error.message) {
      switch (error.error.message) {
        case 'Invalid username or password.':
          errorMessage = 'Invalid username or password.';
          break;
        case 'Login error.':
          errorMessage = 'A server error has occurred, please try again later.';
          break;
        default:
          errorMessage = error.error.message;
      }
    }
    // Return an observable that emits an error
    return throwError(() => new Error(errorMessage));
  }
}