import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  menuItems: MenuItem[] = [];
  orderItems: OrderItem[] = [];
  customerName: string = '';
  orderTotal: number = 0;
  confirmationMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.http.get<MenuItem[]>('http://localhost:3000/api/menu')
      .subscribe({
        next: (data) => {
          this.menuItems = data;
        },
        error: (error) => {
          console.error('Error fetching menu items:', error);
        }
      });
  }

  addToOrder(menuItem: MenuItem): void {
    const existingItem = this.orderItems.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderItems.push({ menuItem, quantity: 1 });
    }
    this.calculateOrderTotal();
  }

  removeFromOrder(orderItem: OrderItem): void {
    const index = this.orderItems.indexOf(orderItem);
    if (index > -1) {
      this.orderItems.splice(index, 1);
    }
    this.calculateOrderTotal();
  }

  updateQuantity(orderItem: OrderItem, newQuantity: number): void {
    if (newQuantity > 0) {
      orderItem.quantity = newQuantity;
    } else {
      // Remove item if quantity is set to 0 or less
      this.removeFromOrder(orderItem);
    }
    this.calculateOrderTotal();
  }

  calculateOrderTotal(): void {
    this.orderTotal = this.orderItems.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  }

  submitOrder(): void {
    this.errorMessage = '';
    this.confirmationMessage = '';
    if (this.orderItems.length === 0) {
      this.errorMessage = 'Please add items to your order.';
      return;
    }
    if (!this.customerName) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    const orderData = {
      name: this.customerName,
      orderitems: JSON.stringify(this.orderItems.map(item => ({
        id: item.menuItem.id,
        quantity: item.quantity
      }))),
      totalprice: this.orderTotal
    };

    this.http.post('http://localhost:3000/api/orders', orderData)
      .subscribe({
        next: (response: any) => {
          this.confirmationMessage = `Thank you, ${this.customerName}! Your order has been placed. Order ID: ${response.orderId}`;
          this.orderItems = [];
          this.customerName = '';
          this.calculateOrderTotal();
        },
        error: (error) => {
          console.error('Error submitting order:', error);
          this.errorMessage = 'There was an error submitting your order. Please try again later.';
        }
      });
  }
}