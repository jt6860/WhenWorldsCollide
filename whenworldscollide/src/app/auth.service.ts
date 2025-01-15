import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs'; // Import 'of' for creating observables

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;

  // Simulate login (replace with your actual logic)
  login(username: string, password: string) { 
    if (username === 'admin' && password === 'password') {
      this.isLoggedIn = true;
      return of({ message: 'Login successful' }); // Return an observable indicating success
    } else {
      return throwError('Invalid username or password');
    }
  }

  logout() {
    this.isLoggedIn = false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
}