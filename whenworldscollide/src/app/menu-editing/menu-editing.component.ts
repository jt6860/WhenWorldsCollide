import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-editing', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  imports: [CommonModule], // List of imported modules used by this component
  templateUrl: './menu-editing.component.html', // Path to the component's HTML template
  styleUrl: './menu-editing.component.css' // Path to the component's CSS styles
})
export class MenuEditingComponent implements OnInit, OnDestroy {
  menuItems: any[] = []; // Array to store menu items
  private menuItemsSubscription: Subscription = new Subscription(); // Subscription for menu items observable

  // Constructor with MatDialog and MenuService injection
  constructor(
    private dialog: MatDialog,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    // Load menu items and then subscribe to updates
    this.menuService.loadMenuItems().subscribe(
      items => {
        this.menuItems = items;
        this.menuItemsSubscription = this.menuService.menuItems$.subscribe(
          updatedItems => this.menuItems = updatedItems
        );
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from the menuItems$ observable to prevent memory leaks
    this.menuItemsSubscription.unsubscribe();
  }

  // Open the Edit Menu Item dialog
  openEditMenuItemDialog(menuItem: any) {
    // Open the dialog using MatDialog, passing in the menu item data
    const dialogRef = this.dialog.open(EditMenuItemDialogComponent, {
      width: '600px',
      data: { ...menuItem } // Pass a copy of the menu item to avoid modifying the original directly
    });

    // Subscribe to the afterClosed() event of the dialog reference
    dialogRef.afterClosed().subscribe(result => {
      // If the dialog was closed with a result (i.e., the user clicked "Save")
      if (result) {
        // Update the menu item
        this.updateMenuItem(result);
      }
    });
  }

  // Update the menu item using the MenuService
  updateMenuItem(menuItem: any) {
    this.menuService.updateMenuItem(menuItem).subscribe({
      next: () => {
        console.log('Updated menu item successfully');
        // Reload menu items after updating
        this.menuService.loadMenuItems().subscribe();
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
      }
    });
  }
}