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

@Component({
  selector: 'app-edit-menu-item-dialog', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  // List of imported modules used by this component
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogTitle,
    MatInputModule,
  ],
  templateUrl: './edit-menu-item-dialog.component.html', // Path to the component's HTML template
  styleUrl: './edit-menu-item-dialog.component.css', // Path to the component's CSS styles
})
export class EditMenuItemDialogComponent {
  // Constructor with MatDialogRef and MAT_DIALOG_DATA injection
  constructor(
    public dialogRef: MatDialogRef<EditMenuItemDialogComponent>, // Reference to the dialog itself
    @Inject(MAT_DIALOG_DATA) public menuItem: any // Injected data (the menu item being edited)
  ) { }

  // Method called when the "Cancel" button is clicked
  onNoClick(): void {
    // Close the dialog without returning any data
    this.dialogRef.close();
  }

  // Method called when the "Save" button is clicked
  onSave(): void {
    // Close the dialog, returning the (potentially modified) menuItem data
    this.dialogRef.close(this.menuItem);
  }
}