import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isLoginMode = true;
  errorMessage: string = '';
  username = '';
  password = '';
  private isLoggedInSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Subscribe to isLoggedIn$ to get the current and future login status
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.router.navigate(['/admin']); // Redirect if already logged in
      }
    });
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe(); // Prevent memory leaks
  }

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLoginMode) {
      const authData = {
        username: this.username,
        password: this.password
      };

      this.authService.login(authData).subscribe({
        next: () => {
          this.errorMessage = ''; //Clear error message on successful login
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.error('Login error:', error);
        }
      });
    } else {
      // Registration logic (if needed)
    }
    form.resetForm();
    this.username = '';
    this.password = '';
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isLoginMode = true;
    this.errorMessage = '';
    this.router.navigate(['/']);
  }
}