import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-editing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-editing.component.html',
  styleUrl: './menu-editing.component.css'
})
export class MenuEditingComponent implements OnInit, OnDestroy {
  menuItems: any[] = [];
  private menuItemsSubscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
      items => this.menuItems = items
    );
  }

  ngOnDestroy() {
    this.menuItemsSubscription.unsubscribe();
  }

  openEditMenuItemDialog(menuItem: any) {
    const dialogRef = this.dialog.open(EditMenuItemDialogComponent, {
      width: '600px',
      data: { ...menuItem }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMenuItem(result);
      }
    });
  }

  updateMenuItem(menuItem: any) {
    this.menuService.updateMenuItem(menuItem).subscribe({
      next: () => {
        console.log('Updated menu item successfully');
      },
      error: (error) => {
        // Error handling
        console.error('Error updating menu item:', error);
      }
    });
  }
}