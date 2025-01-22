import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service'; // Update with correct path
import { Subscription } from 'rxjs';

interface Order {
  id: number;
  name: string;
  orderitems: string;
  totalprice: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [MenuService],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  menuItems: MenuItem[] = [];
  private menuItemsSubscription: Subscription = new Subscription;

  constructor(private http: HttpClient, private menuService: MenuService) { }

  ngOnInit(): void {
    this.fetchOrders();
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      items => this.menuItems = items
    );
  }

  ngOnDestroy(): void {
    this.menuItemsSubscription.unsubscribe();
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:3000/api/orders')
      .subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
  }

  parseOrderItems(orderItemsJson: string): any[] {
    try {
      const orderItems = JSON.parse(orderItemsJson);
      return orderItems.map((item: any) => {
        const menuItem = this.menuService.getMenuItemById(item.id);
        return {
          name: menuItem ? menuItem.name : 'Unknown',
          quantity: item.quantity,
          price: menuItem ? menuItem.price : 0
        };
      });
    } catch (error) {
      console.error('Error parsing order items:', error);
      return [];
    }
  }
}