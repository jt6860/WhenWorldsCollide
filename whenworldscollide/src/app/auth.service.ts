import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface AuthResponseData {
  message: string;
  username?: string;
}

interface AuthData {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(authData: AuthData): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${this.apiUrl}/login`, authData).pipe(
      tap(responseData => {
        this.setLoginStatus(true);
        this.setCurrentUser(responseData.username || null); // Store username
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.setLoginStatus(false);
    this.setCurrentUser(null);
  }

  private setLoginStatus(status: boolean) {
    this.isLoggedInSubject.next(status);
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
  }

  private getStoredLoginStatus(): boolean {
    try {
      const storedLogin = localStorage.getItem('isLoggedIn');
      return storedLogin ? JSON.parse(storedLogin) : false;
    } catch (error) {
      console.error("Error parsing stored login status:", error);
      localStorage.removeItem('isLoggedIn');
      return false;
    }
  }

  private setCurrentUser(username: string | null) {
      this.currentUserSubject.next(username);
      localStorage.setItem('currentUser', JSON.stringify(username));
  }

  private getStoredUser(): string | null {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.error.message) {
      case 'Invalid username or password.':
        errorMessage = 'Invalid username or password.';
        break;
      case 'Login error.':
        errorMessage = 'A server error has occurred, please try again later.';
        break;
      default:
        errorMessage = errorRes.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}