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
  ],
  templateUrl: './edit-menu-item-dialog.component.html',
  styleUrl: './edit-menu-item-dialog.component.css',
})
export class EditMenuItemDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditMenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public menuItem: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.dialogRef.close(this.menuItem);
  }
}