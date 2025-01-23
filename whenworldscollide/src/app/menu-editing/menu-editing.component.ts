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
    this.menuService.loadMenuItems().subscribe( // Load the items
      items => {
        this.menuItems = items;
        this.menuItemsSubscription = this.menuService.menuItems$.subscribe( // Then subscribe
          updatedItems => this.menuItems = updatedItems
        );
      }
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
        // Assuming loadMenuItems returns an observable that completes after fetching
        this.menuService.loadMenuItems().subscribe(); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
      }
    });
  }
}