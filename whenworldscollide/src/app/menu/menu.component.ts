import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service'; // Update with correct path
import { Subscription } from 'rxjs';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  private menuItemsSubscription: Subscription = new Subscription();

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      data => this.menuItems = data
    );
  }

  ngOnDestroy() {
    this.menuItemsSubscription.unsubscribe();
  }
}