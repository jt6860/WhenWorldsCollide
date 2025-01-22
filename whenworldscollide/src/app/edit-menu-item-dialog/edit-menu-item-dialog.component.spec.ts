import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMenuItemDialogComponent } from './edit-menu-item-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

// Mock MatDialogRef
class MatDialogRefMock {
  close() {}
}

describe('EditMenuItemDialogComponent', () => {
  let component: EditMenuItemDialogComponent;
  let fixture: ComponentFixture<EditMenuItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditMenuItemDialogComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatDialogContent,
        MatDialogActions,
        MatDialogTitle
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { /* your mock data here */ } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ... add more tests for your dialog component
});