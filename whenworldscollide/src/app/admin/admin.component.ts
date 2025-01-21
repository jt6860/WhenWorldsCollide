import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminComponent {
  isLoggedIn = false;
  isLoginMode = true;
  errorMessage: string = '';
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

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

      this.authService.login(authData).subscribe({ // Call login with authData object
        next: () => {
          this.isLoggedIn = true;
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password.';
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
  }
}