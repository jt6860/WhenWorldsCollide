import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service'; // Import MenuService
import { Subscription } from 'rxjs';

// Interface to define the structure of an Order object
interface Order {
  id: number;
  name: string;
  orderitems: string; // Note: Stored as a JSON string in the database
  totalprice: number;
}

// Interface for MenuItem
interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-order-list', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  imports: [CommonModule, HttpClientModule], // List of imported modules used by this component
  providers: [MenuService], // Add MenuService to providers to make it injectable
  templateUrl: './order-list.component.html', // Path to the component's HTML template
  styleUrls: ['./order-list.component.css'] // Path to the component's CSS styles
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = []; // Array to store the fetched orders
  menuItems: MenuItem[] = []; // Array to store fetched menu items
  private menuItemsSubscription: Subscription = new Subscription(); // Subscription for menu items

  // Constructor with HttpClient and MenuService injection
  constructor(private http: HttpClient, private menuService: MenuService) { }

  ngOnInit(): void {
    // Fetch orders when the component initializes
    this.fetchOrders();
    // Subscribe to menuItems$ from MenuService to make sure we have the menu data for parsing order items
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      items => this.menuItems = items
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.menuItemsSubscription.unsubscribe();
  }

  // Method to fetch orders from the API
  fetchOrders(): void {
    // Send a GET request to the /api/orders endpoint
    this.http.get<Order[]>('http://localhost:3000/api/orders')
      .subscribe({
        next: (data) => {
          // On successful response, update the orders array with the received data
          this.orders = data;
        },
        error: (error) => {
          // On error, log the error to the console
          console.error('Error fetching orders:', error);
        }
      });
  }

  // Method to parse the orderitems JSON string into an array of objects
  parseOrderItems(orderItemsJson: string): any[] {
    try {
      // Parse the JSON string
      const orderItems = JSON.parse(orderItemsJson);
      // Map the parsed items to an array of objects with name, quantity, and price
      return orderItems.map((item: any) => {
        // Get the corresponding menu item from the menuItems array
        const menuItem = this.menuItems.find(m => m.id === item.id);
        // Return an object with the item's name, quantity, and price
        return {
          name: menuItem ? menuItem.name : 'Unknown', // Handle cases where the menu item might not be found
          quantity: item.quantity,
          price: menuItem ? menuItem.price : 0
        };
      });
    } catch (error) {
      // Log an error if there's an issue parsing the JSON string
      console.error('Error parsing order items:', error);
      return []; // Return an empty array on error
    }
  }
}