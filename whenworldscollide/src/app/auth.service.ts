import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface AuthResponseData {
  message: string;
}

interface AuthData {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;
  private apiUrl = 'http://localhost:3000/api'; // Your backend API URL

  constructor(private http: HttpClient) {}

  login(authData: AuthData): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${this.apiUrl}/login`, authData).pipe(
      tap(responseData => {
        this.isLoggedIn = true;
        console.log("Login Successful: ", responseData.message);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.isLoggedIn = false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
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
      case 'Login error.': //Catching server errors
        errorMessage = 'A server error has occured, please try again later.';
        break;
      default:
        errorMessage = errorRes.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}