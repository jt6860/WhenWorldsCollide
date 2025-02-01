import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, MenuItem } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu', // Selector for using this component in HTML templates
  standalone: true, // Indicates that this is a standalone component
  templateUrl: './menu.component.html', // Path to the HTML template file
  styleUrls: ['./menu.component.css'], // Path to the CSS stylesheet
  imports: [CommonModule] // Imported modules for use in the template (CommonModule for ngFor, etc.)
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = []; // Array to store menu items
  private menuItemsSubscription: Subscription = new Subscription(); // Subscription to the menu items observable

  // Constructor, injecting the MenuService
  constructor(private menuService: MenuService) { }

  ngOnInit() {
    // Subscribe to the menuItems$ observable to get updates on menu items
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      (data) => {
        this.menuItems = data;
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from the menuItems$ observable to prevent memory leaks
    this.menuItemsSubscription.unsubscribe();
  }
}