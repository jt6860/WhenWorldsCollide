import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'When Worlds Collide Pizza'; // Application title
  showMenu = false; // Controls the mobile menu visibility
  isLoggedIn = false; // User login status
  currentUsername: string | null = null; // Currently logged-in username
  private userSub: Subscription = new Subscription(); // Subscription for username
  private loginSub: Subscription = new Subscription(); // Subscription for login status

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to the currentUser$ observable to get the current username
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUsername = user;
    });

    // Subscribe to isLoggedIn$ to get the current login status
    this.loginSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    // Unsubscribe from observables to prevent memory leaks
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

  // Listen for the window's beforeunload event to logout the user when the window is closed
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    if ((event as BeforeUnloadEvent).returnValue) {
      this.authService.logout();
    }
  }
}