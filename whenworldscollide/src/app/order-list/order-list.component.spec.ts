import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService, MenuItem } from '../menu.service';
import { of, throwError, Subscription, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Order } from '../order/order.component';
import { HttpErrorResponse } from '@angular/common/http';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Test Pizza', description: 'Test description', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Test Salad', description: 'Another description', category: 'Salads', price: 8 }
];

const mockOrders: Order[] = [
  {
    id: 1,
    name: 'John Doe',
    orderitems: JSON.stringify([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }]),
    totalprice: 28
  },
  {
    id: 2,
    name: 'Jane Smith',
    orderitems: JSON.stringify([{ id: 2, quantity: 3 }]),
    totalprice: 24
  }
];

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let httpTestingController: HttpTestingController;
  let menuServiceSpy: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    // Create a spy object for MenuService
    menuServiceSpy = jasmine.createSpyObj('MenuService', ['getMenuItemById', 'loadMenuItems']);
    menuServiceSpy.menuItems$ = of(mockMenuItems);
    menuServiceSpy.getMenuItemById.and.callFake((id: number) => {
      return mockMenuItems.find(item => item.id === id);
    });

    await TestBed.configureTestingModule({
      imports: [OrderListComponent, HttpClientTestingModule, CommonModule],
      providers: [{ provide: MenuService, useValue: menuServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle error when parsing order items', () => {
    spyOn(console, 'error');
    const orderItems = component.parseOrderItems('invalid json');
    expect(orderItems).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('should display order details in the table', () => {
    // Directly set orders and menuItems on the component
    component.orders = mockOrders;
    component.menuItems = mockMenuItems;

    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(mockOrders.length);

    mockOrders.forEach((order, index) => {
      const row = tableRows[index];
      expect(row.cells[0].textContent).toContain(order.id.toString());
      expect(row.cells[1].textContent).toContain(order.name);
      expect(row.cells[3].textContent).toContain(order.totalprice.toString());
    });
  });
});