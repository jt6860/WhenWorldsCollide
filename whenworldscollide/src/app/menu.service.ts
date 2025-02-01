import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// Interface for MenuItem
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Injectable({
  providedIn: 'root' // Marks the service as injectable at the root level
})
export class MenuService {
  // BehaviorSubject to hold and emit the current menu items
  private menuItemsSubject: BehaviorSubject<MenuItem[]>;
  // Observable to expose the menu items to other components
  menuItems$: Observable<MenuItem[]>;

  // Base URL for menu API endpoints
  private apiUrl = 'http://localhost:3000/api/menu';

  // Constructor with HttpClient injection and optional mock menu items
  constructor(
    private http: HttpClient,
    // @Optional and @Inject are used for injecting an optional dependency (mockMenuItems)
    @Optional() @Inject('mockMenuItems') initialMenuItems: MenuItem[] = []
  ) {
    // Initialize the BehaviorSubject with initial menu items (if provided) or an empty array
    this.menuItemsSubject = new BehaviorSubject<MenuItem[]>(initialMenuItems);
    // Expose the observable of menu items
    this.menuItems$ = this.menuItemsSubject.asObservable();
    // If no initial menu items are provided, load them from the API
    if (!initialMenuItems || initialMenuItems.length === 0) {
      this.loadMenuItems().subscribe();
    }
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
    // Find the menu item in the current BehaviorSubject value (array of menu items)
    return this.menuItemsSubject.value.find((item) => item.id === id);
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
}