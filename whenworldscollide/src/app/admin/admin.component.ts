import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuEditingComponent } from '../menu-editing/menu-editing.component';
import { ContactSubmissionComponent } from '../contact-submission/contact-submission.component';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'app-admin', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  templateUrl: './admin.component.html', // Path to the component's HTML template
  styleUrls: ['./admin.component.css'], // Path to the component's CSS styles
  // List of imported modules and components used by this component
  imports: [CommonModule, FormsModule, MenuEditingComponent, ContactSubmissionComponent, OrderListComponent]
})
export class AdminComponent implements OnInit, OnDestroy {
  isLoggedIn = false; // Tracks the user's login status
  isLoginMode = true; // Determines whether the login or registration form is displayed
  errorMessage: string = ''; // Stores error messages to display to the user
  username = ''; // Stores the entered username
  password = ''; // Stores the entered password
  activeSection: 'menu' | 'contacts' | 'orders' | null = null; // Tracks which section is currently active
  private isLoggedInSubscription: Subscription = new Subscription(); // Subscription for login status observable

  // Constructor with AuthService and Router injection
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Subscribe to the isLoggedIn$ observable from AuthService to get the current login status
    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      // If the user is logged in, navigate to the admin panel and set the default active section
      if (this.isLoggedIn) {
        this.router.navigate(['/admin']);
        this.activeSection = 'menu'; // Default to menu editing on login
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the isLoggedIn$ observable to prevent memory leaks
    this.isLoggedInSubscription.unsubscribe();
  }

  // Toggle between login and registration mode
  onToggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  // Handle form submission (login or registration)
  onSubmit(form: NgForm) {
    // Prevent submission if the form is invalid
    if (!form.valid) {
      return;
    }

    // Handle login if in login mode
    if (this.isLoginMode) {
      const authData = {
        username: this.username,
        password: this.password
      };

      // Call the login method of the AuthService
      this.authService.login(authData).subscribe({
        next: () => {
          // Clear any previous error messages on successful login
          this.errorMessage = '';
        },
        error: (error: { message: string; }) => {
          // Display an error message on login failure
          this.errorMessage = error.message;
          console.error('Login error:', error);
        }
      });
    } else {
      // Handle registration if in registration mode (if needed)
      // ... (Registration logic would go here) ...
    }

    // Reset the form after submission
    form.resetForm();
    this.username = '';
    this.password = '';
  }

  // Handle user logout
  onLogout() {
    // Call the logout method of the AuthService
    this.authService.logout();
    // Update component state after logout
    this.isLoggedIn = false;
    this.isLoginMode = true;
    this.errorMessage = '';
    this.activeSection = null; // Reset active section
    // Navigate to the home page
    this.router.navigate(['/']);
  }

  // Set the active section for navigation within the admin panel
  showSection(section: 'menu' | 'contacts' | 'orders'): void {
    this.activeSection = section;
  }
}