import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { AppModule } from './module/app.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatIconModule, AppModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'whenworldscollide';

  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}