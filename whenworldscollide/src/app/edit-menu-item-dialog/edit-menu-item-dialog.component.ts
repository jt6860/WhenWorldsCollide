// In edit-menu-item-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MenuItem, WorldPizzaTourItem } from '../menu.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-menu-item-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
    MatInputModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './edit-menu-item-dialog.component.html',
  styleUrl: './edit-menu-item-dialog.component.css',
})
export class EditMenuItemDialogComponent {
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    public dialogRef: MatDialogRef<EditMenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { menuItem: MenuItem | WorldPizzaTourItem, isWorldPizzaTourItem: boolean }
  ) {
    if (!this.data || !this.data.menuItem) {
      console.error('EditMenuItemDialogComponent: No data or menuItem provided.');
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    if (!this.data || !this.data.menuItem) {
      console.error('EditMenuItemDialogComponent: No data or menuItem provided.');
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Pass along the isWorldPizzaTourItem flag
    this.dialogRef.close({ menuItem: this.data.menuItem, isWorldPizzaTourItem: this.data.isWorldPizzaTourItem });
  }

  // Type guard function for WorldPizzaTourItem
  isWorldPizzaTourItem(item: MenuItem | WorldPizzaTourItem): item is WorldPizzaTourItem {
    return (item as WorldPizzaTourItem).month !== undefined;
  }
}