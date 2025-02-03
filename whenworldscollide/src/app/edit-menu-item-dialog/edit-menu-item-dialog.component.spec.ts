import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMenuItemDialogComponent } from './edit-menu-item-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItem } from '../menu.service';
import { MatSelectModule } from '@angular/material/select';

describe('EditMenuItemDialogComponent', () => {
  let component: EditMenuItemDialogComponent;
  let fixture: ComponentFixture<EditMenuItemDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EditMenuItemDialogComponent>>;

  const testMenuItem: MenuItem = { id: 1, name: 'Test Pizza', description: 'A test pizza', price: 9.99, category: 'Test Category' };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        EditMenuItemDialogComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSelectModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { menuItem: testMenuItem, isWorldPizzaTourItem: false } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuItemDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditMenuItemDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on onNoClick', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with updated menu item on onSave', () => {
    const updatedMenuItem: MenuItem = { id: 1, name: 'Updated Test Pizza', description: 'An updated description', price: 12.99, category: 'Test Category' };
    component.data.menuItem = updatedMenuItem;
  
    component.onSave();
  
    expect(dialogRef.close).toHaveBeenCalledWith({ menuItem: updatedMenuItem, isWorldPizzaTourItem: component.data.isWorldPizzaTourItem });
  });
});