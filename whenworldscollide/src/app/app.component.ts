import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
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
  title = 'whenworldscollide';
  showMenu = false;
  isLoggedIn = false;
  currentUsername: string | null = null;
  private userSub: Subscription = new Subscription();
  private loginSub: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUsername = user;
    });
    this.loginSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.loginSub.unsubscribe();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onLogout() {
    this.authService.logout();
  }
}