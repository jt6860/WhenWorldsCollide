import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MenuItem, Option } from '../menu.service';

@Component({
  selector: 'app-select-options-dialog',
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
    MatCheckboxModule,
    MatSelectionList,
    MatListOption,
  ],
  templateUrl: './select-options-dialog.component.html',
})
export class SelectOptionsDialogComponent {
  selectedOptions: Option[] = [];

  constructor(
    public dialogRef: MatDialogRef<SelectOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      menuItem: MenuItem;
      selectedOptions: Option[];
    }
  ) {
    // Initialize selectedOptions from the dialog data, if available
    if (data.selectedOptions) {
      this.selectedOptions = [...data.selectedOptions];
    }

    // Ensure that options is an array of Option objects
    if (data.menuItem && typeof data.menuItem.options === 'string') {
      try {
        data.menuItem.options = JSON.parse(data.menuItem.options);
      } catch (error) {
        console.error('Error parsing options:', error);
        // data.menuItem.options = [];
      }
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    // Close the dialog and pass the selected options
    this.dialogRef.close({ selectedOptions: this.selectedOptions });
  }

  // Check if an option is selected
  isSelected(option: Option): boolean {
    return this.selectedOptions.some(
      (selectedOption) => selectedOption.name === option.name
    );
  }

  // Toggle the selection status of an option
  toggleOption(option: Option): void {
    const index = this.selectedOptions.findIndex(
      (selectedOption) => selectedOption.name === option.name
    );
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }
  }
}