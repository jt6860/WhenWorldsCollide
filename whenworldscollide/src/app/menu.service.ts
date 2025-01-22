import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
}