import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, combineLatest, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// Interface for MenuItem
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

export interface WorldPizzaTourItem extends MenuItem {
  month: string;
  menu_item_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Base URL for menu API endpoints
  private apiUrl = 'http://localhost:3000/api/menu';
  private worldPizzaTourApiUrl = 'http://localhost:3000/api/world-pizza-tour';

  // BehaviorSubject to hold and emit the current menu items
  private menuItemsSubject: BehaviorSubject<MenuItem[]>;
  // Observable to expose the menu items to other components
  menuItems$: Observable<MenuItem[]>;

  // BehaviorSubject for World Pizza Tour items
  private worldPizzaTourSubject: BehaviorSubject<WorldPizzaTourItem[]>;
  worldPizzaTour$: Observable<WorldPizzaTourItem[]>;

  // Combined observable
  combinedMenuItems$: Observable<(MenuItem | WorldPizzaTourItem)[]>;

  constructor(
    private http: HttpClient,
    @Optional() @Inject('mockMenuItems') initialMenuItems: MenuItem[] = []
  ) {
    // Initialize menuItemsSubject and menuItems$
    this.menuItemsSubject = new BehaviorSubject<MenuItem[]>(initialMenuItems || []);
    this.menuItems$ = this.menuItemsSubject.asObservable();

    // Initialize worldPizzaTourSubject and worldPizzaTour$
    this.worldPizzaTourSubject = new BehaviorSubject<WorldPizzaTourItem[]>([]);
    this.worldPizzaTour$ = this.worldPizzaTourSubject.asObservable();

    // Now initialize combinedMenuItems$ using the initialized observables
    this.combinedMenuItems$ = combineLatest([
      this.menuItems$,
      this.worldPizzaTour$
    ]).pipe(
      map(([menuItems, worldPizzaTourItems]) => {
        const worldPizzaCategory = 'World Pizza Tour';
        const regularMenuItems = menuItems.filter(item => item.category !== worldPizzaCategory);

        return [
          ...regularMenuItems,
          ...worldPizzaTourItems
        ];
      })
    );
  }

  // Fetch menu items
  loadMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching menu items:', error);
        return throwError(() => new Error('Error fetching menu items.'));
      }),
      tap(menuItems => this.menuItemsSubject.next(menuItems))
    );
  }

  // Get menu item by ID
  getMenuItemById(id: number): MenuItem | undefined {
    return this.menuItemsSubject.value.find(item => item.id === id);
  }

  // Update menu item
  updateMenuItem(menuItem: MenuItem): Observable<any> {
    // Send a PUT request to the /menu/:id endpoint with the updated menu item data
    return this.http.put<any>(`${this.apiUrl}/${menuItem.id}`, menuItem).pipe(
      // Use tap operator to update the menuItemsSubject with the updated item
      tap(() => {
        const updatedMenuItems = this.menuItemsSubject.value.map((item) =>
          item.id === menuItem.id ? menuItem : item
        );
        this.menuItemsSubject.next(updatedMenuItems);
      }),
      // Use catchError operator to handle errors during the API call
      catchError((error) => {
        console.error('Error updating menu item:', error);
        // Throw a user-friendly error message
        return throwError(() => new Error('An error occurred. Please try again later.'));
      })
    );
  }

  // Method to fetch World Pizza Tour items for the current month and the next month
  loadWorldPizzaTour(): Observable<WorldPizzaTourItem[]> {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonth = nextMonthDate.toLocaleString('default', { month: 'long' });

    const currentMonthUrl = `${this.worldPizzaTourApiUrl}?month=${currentMonth}`;
    const nextMonthUrl = `${this.worldPizzaTourApiUrl}?month=${nextMonth}`;

    // Use forkJoin to make requests in parallel and wait for both to complete
    return forkJoin({
      currentMonthItems: this.http.get<WorldPizzaTourItem[]>(currentMonthUrl),
      nextMonthItems: this.http.get<WorldPizzaTourItem[]>(nextMonthUrl)
    }).pipe(
      map(results => {
        // Combine the results, filter out duplicates
        const combinedItems = [...results.currentMonthItems, ...results.nextMonthItems];
        return combinedItems.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.month === item.month && t.name === item.name
          ))
        );
      }),
      catchError((error) => {
        console.error('Error fetching World Pizza Tour items:', error);
        return throwError(() => new Error('Error fetching World Pizza Tour items.'));
      }),
      tap(worldPizzaTourItems => this.worldPizzaTourSubject.next(worldPizzaTourItems))
    );
  }

  // Method to get a specific World Pizza Tour item by ID
  getWorldPizzaTourItemById(id: number): WorldPizzaTourItem | undefined {
    return this.worldPizzaTourSubject.value.find(item => item.id === id);
  }

  // Method to update a World Pizza Tour item
  updateWorldPizzaTourItem(item: WorldPizzaTourItem): Observable<any> {
    return this.http.put<any>(`${this.worldPizzaTourApiUrl}/${item.id}`, item).pipe(
      tap(() => {
        const updatedItems = this.worldPizzaTourSubject.value.map(i =>
          i.id === item.id ? item : i
        );
        this.worldPizzaTourSubject.next(updatedItems);
      }),
      catchError((error) => {
        console.error('Error updating World Pizza Tour item:', error);
        return throwError(() => new Error('Error updating World Pizza Tour item.'));
      })
    );
  }
}