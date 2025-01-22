import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-menu-item-dialog',
  imports: [MatFormFieldModule, FormsModule],
  templateUrl: './edit-menu-item-dialog.component.html',
  styleUrl: './edit-menu-item-dialog.component.css'
})
export class EditMenuItemDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditMenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public menuItem: any
  ) { }

  onNoClick(): void { this.dialogRef.close(); }
  onSave(): void { this.dialogRef.close(this.menuItem); }
}