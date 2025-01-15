import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Your authentication service
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminComponent {
  isLoggedIn = false;
  isLoginMode = true; // Start in login mode

  constructor(private authService: AuthService, private router: Router, private commonModule: CommonModule) {}

  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: any) {
    if (this.isLoginMode) {
      // Handle login logic
      this.authService.login(form.value.username, form.value.password)
        .subscribe(
          () => {
            this.isLoggedIn = true;
            this.router.navigate(['/admin/dashboard']); // Redirect to admin dashboard
          },
          (error) => {
            // Handle login error
          }
        );
    } else {
      // Handle registration logic (if applicable)
    }
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isLoginMode = true; // Switch back to login mode
  }
}