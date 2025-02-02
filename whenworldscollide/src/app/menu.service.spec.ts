import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService, MenuItem, WorldPizzaTourItem } from './menu.service';
import { of } from 'rxjs';

describe('MenuService', () => {
  let service: MenuService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });
    service = TestBed.inject(MenuService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch menu items on initialization', () => {
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Pizza', description: 'Delicious pizza', category: 'Pizzas', price: 10 },
      { id: 2, name: 'Salad', description: 'Healthy salad', category: 'Salads', price: 5 }
    ];

    // Expect the initial request made by fetchMenuItems in the constructor
    const req = httpTestingController.expectOne('http://localhost:3000/api/menu');
    expect(req.request.method).toEqual('GET');
    req.flush(mockMenuItems); // Provide initial data

    // Now subscribe to menuItems$ to make assertions
    service.menuItems$.subscribe(menuItems => {
      expect(menuItems.length).toEqual(2);
      expect(menuItems).toEqual(mockMenuItems);
    });
  });

  it('should update a menu item', fakeAsync(() => {
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Pizza', description: 'Delicious pizza', category: 'Pizzas', price: 10 },
      { id: 2, name: 'Salad', description: 'Healthy salad', category: 'Salads', price: 5 }
    ];

    const updatedMenuItem: MenuItem = { id: 1, name: 'Updated Pizza', description: 'Very Delicious', category: 'Pizzas', price: 12 };

    // Flush the initial data
    const initialReq = httpTestingController.expectOne('http://localhost:3000/api/menu');
    expect(initialReq.request.method).toEqual('GET');
    initialReq.flush(mockMenuItems);

    service.updateMenuItem(updatedMenuItem).subscribe(response => {
      expect(response).toEqual(updatedMenuItem);
    });

    const updateReq = httpTestingController.expectOne(`http://localhost:3000/api/menu/${updatedMenuItem.id}`);
    expect(updateReq.request.method).toEqual('PUT');
    updateReq.flush(updatedMenuItem);

    tick();

    // Verify that the menuItemsSubject has been updated
    service.menuItems$.subscribe(menuItems => {
      const item = menuItems.find(i => i.id === updatedMenuItem.id);
      expect(item).toEqual(updatedMenuItem);
    });
  }));

  it('should handle errors when updating a menu item', fakeAsync(() => {
    const menuItemToUpdate: MenuItem = { id: 1, name: 'Pizza', description: 'Delicious', category: 'Pizzas', price: 10 };
    const expectedErrorMessage = 'An error occurred. Please try again later.';

    // Flush the initial data
    const initialReq = httpTestingController.expectOne('http://localhost:3000/api/menu');
    expect(initialReq.request.method).toEqual('GET');
    initialReq.flush([]);

    service.updateMenuItem(menuItemToUpdate).subscribe({
      next: () => fail('The request should have failed with an error'),
      error: (err: Error) => expect(err.message).toEqual(expectedErrorMessage)
    });

    const updateReq = httpTestingController.expectOne(`http://localhost:3000/api/menu/${menuItemToUpdate.id}`);
    expect(updateReq.request.method).toEqual('PUT');
    updateReq.error(new ErrorEvent('Network error', { message: 'Failed to update menu item.' }));

    tick();
  }));

  it('should get a menu item by ID', () => {
    const mockMenuItems: MenuItem[] = [
      { id: 1, name: 'Pizza', description: 'Delicious', category: 'Pizzas', price: 10 },
      { id: 2, name: 'Salad', description: 'Healthy', category: 'Salads', price: 5 }
    ];

    // Flush the initial data
    const initialReq = httpTestingController.expectOne('http://localhost:3000/api/menu');
    expect(initialReq.request.method).toEqual('GET');
    initialReq.flush(mockMenuItems);

    const menuItem = service.getMenuItemById(1);
    expect(menuItem).toEqual(mockMenuItems[0]);

    const nonExistentMenuItem = service.getMenuItemById(99);
    expect(nonExistentMenuItem).toBeUndefined();
  });
});