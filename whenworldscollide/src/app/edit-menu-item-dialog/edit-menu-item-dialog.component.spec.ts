import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMenuItemDialogComponent } from './edit-menu-item-dialog.component';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

const mockMenuItem = {
  id: 1,
  name: 'Test Pizza',
  description: 'A delicious test pizza',
  price: 10.99,
  category: 'Pizzas'
};

describe('EditMenuItemDialogComponent', () => {
  let component: EditMenuItemDialogComponent;
  let fixture: ComponentFixture<EditMenuItemDialogComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
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
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMenuItem }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuItemDialogComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with injected data', () => {
    expect(component.menuItem.name).toBe(mockMenuItem.name);
    expect(component.menuItem.description).toBe(mockMenuItem.description);
    expect(component.menuItem.price).toBe(mockMenuItem.price);
  });

  it('should close the dialog when onNoClick is called', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with updated data when onSave is called', () => {
    const updatedMenuItem = {
      ...mockMenuItem,
      name: 'Updated Test Pizza',
      description: 'An updated description',
      price: 12.99,
      category: 'Signature Pizzas'
    };
  
    component.menuItem = { ...updatedMenuItem };
    component.onSave();
  
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.menuItem);
  });

  it('should display the correct title', () => {
    const titleElement = de.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Edit Menu Item');
  });

  it('should bind input values to menuItem properties', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const nameInput = de.query(By.css('input[name="name"]')).nativeElement;
      const descriptionInput = de.query(By.css('textarea[name="description"]')).nativeElement;
      const priceInput = de.query(By.css('input[name="price"]')).nativeElement;
  
      expect(nameInput.value).toBe(mockMenuItem.name);
      expect(descriptionInput.value).toBe(mockMenuItem.description);
      expect(priceInput.value).toBe(mockMenuItem.price.toString());
    });
  });

  it('should update menuItem properties on input change', () => {
    const newName = 'New Pizza Name';
    const newDescription = 'New pizza description';
    const newPrice = 9.99;

    fixture.detectChanges();

    const nameInput = fixture.nativeElement.querySelector('input[name="name"]');
    const descriptionInput = fixture.nativeElement.querySelector('textarea[name="description"]');
    const priceInput = fixture.nativeElement.querySelector('input[name="price"]');

    nameInput.value = newName;
    descriptionInput.value = newDescription;
    priceInput.value = newPrice;

    nameInput.dispatchEvent(new Event('input'));
    descriptionInput.dispatchEvent(new Event('input'));
    priceInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.menuItem.name).toBe(newName);
    expect(component.menuItem.description).toBe(newDescription);
    expect(component.menuItem.price).toBe(newPrice);
  });

  it('should call onSave when the Save button is clicked', () => {
    spyOn(component, 'onSave');
    const saveButton = fixture.nativeElement.querySelector('button[color="primary"]');

    saveButton.click();
    fixture.detectChanges();

    expect(component.onSave).toHaveBeenCalled();
  });

  it('should call onNoClick when the Cancel button is clicked', () => {
    spyOn(component, 'onNoClick');
    const cancelButton = fixture.nativeElement.querySelector('button:not([color="primary"])');

    cancelButton.click();
    fixture.detectChanges();

    expect(component.onNoClick).toHaveBeenCalled();
  });
});