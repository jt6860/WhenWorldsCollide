import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'whenworldscollide';

  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}