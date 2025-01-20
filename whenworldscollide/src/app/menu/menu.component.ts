import { Component, OnInit, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<MenuItem[]>('http://127.0.0.1:3000/api/menu')
      .subscribe({
        next: (data) => { 
          this.menuItems = data;
          console.log(data);
        },
        error: (error) => {
          console.error('Error fetching menu:', error);
          // Handle the error
        }
      });
  }
}