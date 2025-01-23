import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  // List of imported modules and components used by this component
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html', // Path to the component's HTML template
  styleUrls: ['./app.component.css'] // Path to the component's CSS styles
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'When Worlds Collide Pizza'; // Application title
  showMenu = false; // Controls the mobile menu visibility (default: false)
  isLoggedIn = false; // User login status (default: false)
  currentUsername: string | null = null; // Currently logged-in username (default: null)
  private userSub: Subscription = new Subscription(); // Subscription for username observable
  private loginSub: Subscription = new Subscription(); // Subscription for login status observable

  // Constructor with AuthService injection
  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to the currentUser$ observable from AuthService to get the current username
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUsername = user;
    });

    // Subscribe to isLoggedIn$ from AuthService to get the current login status
    this.loginSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    // Unsubscribe from observables to prevent memory leaks when the component is destroyed
    this.userSub.unsubscribe();
    this.loginSub.unsubscribe();
  }

  // Toggle the mobile menu visibility
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // Logout the user
  onLogout() {
    this.authService.logout();
  }

  // Listen for the window's beforeunload event (e.g., closing or refreshing the browser tab)
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    // If the event's returnValue is true (indicating a confirmation), log the user out
    // This handles cases where the user closes the tab without explicitly logging out
    if ((event as BeforeUnloadEvent).returnValue) {
      this.authService.logout();
    }
  }
}