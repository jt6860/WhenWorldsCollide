// admin.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuEditingComponent } from '../menu-editing/menu-editing.component';
import { ContactSubmissionComponent } from '../contact-submission/contact-submission.component'; // Import the new component

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule, MenuEditingComponent, ContactSubmissionComponent]
})
export class AdminComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isLoginMode = true;
  errorMessage: string = '';
  username = '';
  password = '';
  activeSection: 'menu' | 'contacts' | null = null; // Track the active section
  private isLoggedInSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.router.navigate(['/admin']);
        this.activeSection = 'menu'; // Default to menu editing on login
      }
    });
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
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
          this.errorMessage = '';
        },
        error: (error: { message: string; }) => {
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
    this.activeSection = null; // Reset active section
    this.router.navigate(['/']);
  }

  showSection(section: 'menu' | 'contacts'): void {
    this.activeSection = section;
  }
}