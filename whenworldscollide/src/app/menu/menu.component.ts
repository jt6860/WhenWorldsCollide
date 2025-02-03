import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, MenuItem, WorldPizzaTourItem } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: (MenuItem | WorldPizzaTourItem)[] = [];
  private menuItemsSubscription: Subscription = new Subscription();

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    // Load data when component initializes
    this.menuService.loadMenuItems().subscribe();
    this.menuService.loadWorldPizzaTour().subscribe();
    this.menuItemsSubscription = this.menuService.combinedMenuItems$.subscribe(
      (data) => {
        this.menuItems = data;
      }
    );
  }

  ngOnDestroy() {
    this.menuItemsSubscription.unsubscribe();
  }

  // Type guard function for WorldPizzaTourItem
  isWorldPizzaTourItem(item: MenuItem | WorldPizzaTourItem): item is WorldPizzaTourItem {
    return (item as WorldPizzaTourItem).month !== undefined;
  }
}