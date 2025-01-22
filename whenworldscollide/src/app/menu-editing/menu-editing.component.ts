import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-editing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-editing.component.html',
  styleUrl: './menu-editing.component.css'
})
export class MenuEditingComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit() { this.fetchMenuItems(); }

  fetchMenuItems() {
    this.http.get<any[]>('http://localhost:3000/api/menu').subscribe(data => {
      this.menuItems = data;
    });
  }

  openEditMenuItemDialog(menuItem: any) {
    const dialogRef = this.dialog.open(EditMenuItemDialogComponent, {
      width: '600px',
      data: { ...menuItem } // Important: Create a copy
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMenuItem(result);
      }
    });
  }

  updateMenuItem(menuItem: any) {
    this.http.put<any>(`http://localhost:3000/api/menu/${menuItem.id}`, menuItem)
      .subscribe(() => {
        this.fetchMenuItems(); // Refresh after update
      });
  }
}