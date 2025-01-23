import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject: BehaviorSubject<MenuItem[]>;
  menuItems$: Observable<MenuItem[]>;

  private apiUrl = 'http://localhost:3000/api/menu';

  constructor(
    private http: HttpClient,
    @Optional() @Inject('mockMenuItems') initialMenuItems: MenuItem[] = []
  ) {
    this.menuItemsSubject = new BehaviorSubject<MenuItem[]>(initialMenuItems);
    this.menuItems$ = this.menuItemsSubject.asObservable();
    if (!initialMenuItems || initialMenuItems.length === 0) {
      this.loadMenuItems().subscribe();
    }
  }

  loadMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl)
      .pipe(
        tap(menuItems => this.menuItemsSubject.next(menuItems)),
        catchError((error) => {
          console.error('Error fetching menu items:', error);
          return throwError(() => new Error('Error fetching menu items.'));
        })
      );
  }

  getMenuItemById(id: number): MenuItem | undefined {
    return this.menuItemsSubject.value.find(item => item.id === id);
  }

  updateMenuItem(menuItem: MenuItem): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${menuItem.id}`, menuItem).pipe(
      tap(() => {
        // Update the menuItemsSubject with the updated item
        const updatedMenuItems = this.menuItemsSubject.value.map(item =>
          item.id === menuItem.id ? menuItem : item
        );
        this.menuItemsSubject.next(updatedMenuItems);
      }),
      catchError((error) => {
        console.error('Error updating menu item:', error);
        // Throw the correct error message
        return throwError(() => new Error('An error occurred. Please try again later.'));
      })
    );
  }
}