import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuEditingComponent } from './menu-editing.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MenuService, MenuItem } from '../menu.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Test Pizza', description: 'Test description', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Test Salad', description: 'Another description', category: 'Salads', price: 8 }
];

describe('MenuEditingComponent', () => {
  let component: MenuEditingComponent;
  let fixture: ComponentFixture<MenuEditingComponent>;
  let menuService: jasmine.SpyObj<MenuService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['updateMenuItem', 'loadMenuItems', 'menuItems$']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [MenuEditingComponent, HttpClientTestingModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: MenuService, useValue: menuServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEditingComponent);
    component = fixture.componentInstance;
    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    httpTestingController = TestBed.inject(HttpTestingController);

    menuService.menuItems$ = of(mockMenuItems);
    menuService.loadMenuItems.and.returnValue(of(mockMenuItems));
    menuService.updateMenuItem.and.returnValue(of({}));

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items on ngOnInit', () => {
    expect(component.menuItems.length).toBe(2);
    expect(component.menuItems).toEqual(mockMenuItems);
  });

  it('should open dialog with menu item data when openEditMenuItemDialog is called', () => {
    const mockDialogRef = jasmine.createSpyObj('dialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(mockMenuItems[0]));
    dialog.open.and.returnValue(mockDialogRef);
  
    component.openEditMenuItemDialog(mockMenuItems[0]);
  
    // Verify that dialog.open was called with the correct arguments
    expect(dialog.open).toHaveBeenCalledWith(EditMenuItemDialogComponent, {
      width: '600px',
      data: { menuItem: { ...mockMenuItems[0] } } // Ensure the structure matches
    });
  });

  it('should update menu item on dialog close with result', fakeAsync(() => {
    const updatedMenuItem: MenuItem = { ...mockMenuItems[0], name: 'Updated Pizza' };
    const mockDialogRef = jasmine.createSpyObj('dialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(updatedMenuItem));
    dialog.open.and.returnValue(mockDialogRef);
  
    menuService.updateMenuItem.and.returnValue(of(updatedMenuItem));
  
    component.openEditMenuItemDialog(mockMenuItems[0]);
    tick();
  
    expect(menuService.updateMenuItem).toHaveBeenCalledWith(updatedMenuItem);
  }));

  it('should not update menu item on dialog close without result', fakeAsync(() => {
    const mockDialogRef = jasmine.createSpyObj('dialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(null)); // Dialog closed without a result
    dialog.open.and.returnValue(mockDialogRef);

    component.openEditMenuItemDialog(mockMenuItems[0]);
    tick();

    expect(menuService.updateMenuItem).not.toHaveBeenCalled();
  }));

  it('should handle error when updating menu item', () => {
    const errorResponse = new Error('Update failed');
    menuService.updateMenuItem.and.returnValue(throwError(() => errorResponse));

    spyOn(console, 'error');

    component.updateMenuItem(mockMenuItems[0]);

    expect(console.error).toHaveBeenCalledWith('Error updating menu item:', errorResponse);
  });

  it('should display menu items', () => {
    fixture.detectChanges(); // Ensure component is updated
    const itemElements = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(itemElements.length).toBe(mockMenuItems.length);

    mockMenuItems.forEach((item, index) => {
      const itemElement = itemElements[index];
      expect(itemElement.query(By.css('h3')).nativeElement.textContent).toContain(item.name);
    });
  });

  it('should call openEditMenuItemDialog when Edit button is clicked', () => {
    spyOn(component, 'openEditMenuItemDialog');
    fixture.detectChanges();
    const editButtons = fixture.debugElement.queryAll(By.css('.actions button'));
    editButtons[0].triggerEventHandler('click', null); // Simulate click on first button
    expect(component.openEditMenuItemDialog).toHaveBeenCalledWith(mockMenuItems[0]);
  });
});