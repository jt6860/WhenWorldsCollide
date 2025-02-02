import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { CommonModule } from '@angular/common';
import { MenuService, MenuItem, WorldPizzaTourItem } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-editing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-editing.component.html',
  styleUrl: './menu-editing.component.css'
})
export class MenuEditingComponent implements OnInit, OnDestroy {
  menuItems: (MenuItem | WorldPizzaTourItem)[] = [];
  private combinedItemsSubscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    // Load menu items and World Pizza Tour items, then subscribe to updates
    this.menuService.loadMenuItems().subscribe();
    this.menuService.loadWorldPizzaTour().subscribe(
      () => {
        this.combinedItemsSubscription = this.menuService.combinedMenuItems$.subscribe(
          updatedItems => this.menuItems = updatedItems
        );
      }
    );
  }

  ngOnDestroy() {
    this.combinedItemsSubscription.unsubscribe();
  }

  openEditMenuItemDialog(item: MenuItem | WorldPizzaTourItem) {
    const dialogRef = this.dialog.open(EditMenuItemDialogComponent, {
      width: '600px',
      data: {
        menuItem: 'month' in item ? { ...item } : { ...item }, // Check for 'month' to identify WorldPizzaTourItem
        isWorldPizzaTourItem: 'month' in item // Pass a flag to indicate if it's a WorldPizzaTourItem
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isWorldPizzaTourItem) {
          this.updateWorldPizzaTourItem(result.menuItem);
        } else {
          this.updateMenuItem(result.menuItem);
        }
      }
    });
  }
  

  updateMenuItem(menuItem: MenuItem) {
    this.menuService.updateMenuItem(menuItem).subscribe({
      next: () => {
        console.log('Updated menu item successfully');
        this.menuService.loadMenuItems().subscribe();
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
      },
    });
  }

  updateWorldPizzaTourItem(item: WorldPizzaTourItem) {
    this.menuService.updateWorldPizzaTourItem(item).subscribe({
      next: () => {
        console.log('Updated World Pizza Tour item successfully');
        this.menuService.loadWorldPizzaTour().subscribe();
      },
      error: (error) => {
        console.error('Error updating World Pizza Tour item:', error);
      },
    });
  }
}