import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface MenuItem {
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
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  menuItems$ = this.menuItemsSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/menu';

  constructor(private http: HttpClient) {
    this.fetchMenuItems();
  }

  private fetchMenuItems(): void {
    this.http.get<MenuItem[]>(this.apiUrl)
      .pipe(
        tap(menuItems => this.menuItemsSubject.next(menuItems))
      )
      .subscribe({
        error: (error) => console.error('Error fetching menu items:', error)
      });
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
        // You can do more sophisticated error handling here, like showing a user-friendly message.
        return throwError(() => new Error('Failed to update menu item.')); // Re-throw the error to be handled by the component
      })
    );
  }
}