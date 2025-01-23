import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../menu.service'; // Import MenuService to fetch menu items
import { Subscription } from 'rxjs';

// Interface to define the structure of a MenuItem object
interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

// Interface to define the structure of an OrderItem object
interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

// Interface to define the structure of an Order object
export interface Order {
  id: number;
  name: string;
  orderitems: string; // Keep as string since it's JSON
  totalprice: number;
}

@Component({
  selector: 'app-order', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  // List of imported modules used by this component
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html', // Path to the component's HTML template
  styleUrls: ['./order.component.css'] // Path to the component's CSS styles
})
export class OrderComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = []; // Array to store the fetched menu items
  orderItems: OrderItem[] = []; // Array to store the items in the current order
  customerName: string = ''; // Customer's name for the order
  orderTotal: number = 0; // Total price of the order
  confirmationMessage: string = ''; // Confirmation message to be displayed
  errorMessage: string = ''; // Error message to be displayed
  private menuItemsSubscription: Subscription = new Subscription(); // Subscription for menu items observable

  // Constructor with HttpClient and MenuService injection
  constructor(private http: HttpClient, private menuService: MenuService) { }

  ngOnInit(): void {
    // Subscribe to the menuItems$ observable from MenuService to get the menu items
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      data => this.menuItems = data
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from the menuItems$ observable to prevent memory leaks
    this.menuItemsSubscription.unsubscribe();
  }

  // Add an item to the order
  addToOrder(menuItem: MenuItem): void {
    // Check if the item is already in the order
    const existingItem = this.orderItems.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      // If it exists, increment the quantity
      existingItem.quantity++;
    } else {
      // If it doesn't exist, add it to the order with a quantity of 1
      this.orderItems.push({ menuItem, quantity: 1 });
    }
    // Recalculate the order total
    this.calculateOrderTotal();
  }

  // Remove an item from the order
  removeFromOrder(orderItem: OrderItem): void {
    // Find the index of the item in the orderItems array
    const index = this.orderItems.indexOf(orderItem);
    if (index > -1) {
      // Remove the item from the array
      this.orderItems.splice(index, 1);
    }
    // Recalculate the order total
    this.calculateOrderTotal();
  }

  // Update the quantity of an item in the order
  updateQuantity(orderItem: OrderItem, newQuantity: number): void {
    if (newQuantity > 0) {
      // If the new quantity is valid, update the quantity
      orderItem.quantity = newQuantity;
    } else {
      // If the new quantity is 0 or less, remove the item from the order
      this.removeFromOrder(orderItem);
    }
    // Recalculate the order total
    this.calculateOrderTotal();
  }

  // Calculate the total price of the order
  calculateOrderTotal(): void {
    this.orderTotal = this.orderItems.reduce((total, item) => {
      // Multiply each item's price by its quantity and add it to the total
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  }

  // Submit the order
  submitOrder(): void {
    // Reset error and confirmation messages
    this.errorMessage = '';
    this.confirmationMessage = '';

    // Check if the order is empty
    if (this.orderItems.length === 0) {
      this.errorMessage = 'Please add items to your order.';
      return;
    }

    // Check if the customer's name is provided
    if (!this.customerName) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    // Prepare the order data for submission
    const orderData = {
      name: this.customerName,
      orderitems: JSON.stringify(this.orderItems.map(item => ({
        id: item.menuItem.id,
        quantity: item.quantity
      }))),
      totalprice: this.orderTotal
    };

    // Send a POST request to the /api/orders endpoint with the order data
    this.http.post('http://localhost:3000/api/orders', orderData)
      .subscribe({
        next: (response: any) => {
          // On successful submission, display a confirmation message
          this.confirmationMessage = `Thank you, ${this.customerName}! Your order has been placed. Order ID: ${response.orderId}`;
          // Reset the order form
          this.orderItems = [];
          this.customerName = '';
          this.calculateOrderTotal();
        },
        error: (error) => {
          // On error, log the error to the console and display an error message
          console.error('Error submitting order:', error);
          this.errorMessage = 'There was an error submitting your order. Please try again later.';
        }
      });
  }
}