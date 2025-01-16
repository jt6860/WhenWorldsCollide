import { Component, OnInit, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../module/app.module';
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
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [AppModule],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<MenuItem[]>('/api/menu')
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