import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService, MenuItem, WorldPizzaTourItem } from '../menu.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Mock menu items
const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Test Pizza', description: 'Test description', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Test Salad', description: 'Another description', category: 'Salads', price: 8 }
];

// Mock World Pizza Tour Items
const mockWorldPizzaTourItems: WorldPizzaTourItem[] = [
  { id: 3, menu_item_id: 3, name: 'Test World Pizza', description: 'Test world pizza description', month: 'July', category: 'World Pizza Tour', price: 10 },
];

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let httpTestingController: HttpTestingController;
  let menuService: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    menuService = jasmine.createSpyObj('MenuService', ['loadMenuItems', 'loadWorldPizzaTour', 'combinedMenuItems$']);

    await TestBed.configureTestingModule({
      imports: [OrderComponent, HttpClientTestingModule, FormsModule, CommonModule],
      providers: [{ provide: MenuService, useValue: menuService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock combinedMenuItems$ to return both menu items and world pizza tour items
    menuService.combinedMenuItems$ = of([...mockMenuItems, ...mockWorldPizzaTourItems]);
    menuService.loadMenuItems.and.returnValue(of(mockMenuItems));
    menuService.loadWorldPizzaTour.and.returnValue(of(mockWorldPizzaTourItems));

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menuItems from MenuService', () => {
    expect(component.menuItems.length).toBe(3);
    expect(component.menuItems).toEqual([...mockMenuItems, ...mockWorldPizzaTourItems]);
  });

  it('should add an item to the order', () => {
    component.addToOrder(mockMenuItems[0]);
    expect(component.orderItems.length).toBe(1);
    expect(component.orderItems[0].menuItem).toEqual(mockMenuItems[0]);
    expect(component.orderItems[0].quantity).toBe(1);
  });

  it('should increase quantity if item already in order', () => {
    component.addToOrder(mockMenuItems[0]);
    component.addToOrder(mockMenuItems[0]);
    expect(component.orderItems.length).toBe(1);
    expect(component.orderItems[0].quantity).toBe(2);
  });

  it('should remove an item from the order', () => {
    component.addToOrder(mockMenuItems[0]);
    component.removeFromOrder(component.orderItems[0]);
    expect(component.orderItems.length).toBe(0);
  });

  it('should update quantity of an item in the order', () => {
    component.addToOrder(mockMenuItems[0]);
    component.updateQuantity(component.orderItems[0], 3);
    expect(component.orderItems[0].quantity).toBe(3);
  });

  it('should remove item from order if updated quantity is 0', () => {
    component.addToOrder(mockMenuItems[0]);
    component.updateQuantity(component.orderItems[0], 0);
    expect(component.orderItems.length).toBe(0);
  });

  it('should calculate the order total correctly', () => {
    component.addToOrder(mockMenuItems[0]);
    component.addToOrder(mockMenuItems[1]);
    component.updateQuantity(component.orderItems[0], 2);
    component.calculateOrderTotal();
    expect(component.orderTotal).toBe(28); // (10 * 2) + 8
  });

  it('should submit an order successfully', fakeAsync(() => {
    const mockOrderResponse = { orderId: 123 };
    const customerName = 'Test User';

    component.addToOrder(mockMenuItems[0]);
    component.customerName = customerName;
    component.submitOrder();

    // This intercepts the POST request:
    const req = httpTestingController.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toEqual('POST');
    req.flush(mockOrderResponse); // Simulate a successful response

    tick(); // Advance the virtual clock

    expect(component.confirmationMessage).toContain(customerName);
    expect(component.confirmationMessage).toContain(mockOrderResponse.orderId.toString());
    expect(component.orderItems.length).toBe(0);
    expect(component.customerName).toBe('');
    expect(component.orderTotal).toBe(0);
  }));

  it('should show error message if order is empty', () => {
    component.submitOrder();
    expect(component.errorMessage).toBe('Please add items to your order.');
  });

  it('should show error message if customer name is not provided', () => {
    component.addToOrder(mockMenuItems[0]);
    component.submitOrder();
    expect(component.errorMessage).toBe('Please enter your name.');
  });
});