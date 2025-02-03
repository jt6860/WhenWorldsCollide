import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuEditingComponent } from './menu-editing.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MenuService, MenuItem, WorldPizzaTourItem } from '../menu.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditMenuItemDialogComponent } from '../edit-menu-item-dialog/edit-menu-item-dialog.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Test Pizza', description: 'Test description', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Test Salad', description: 'Another description', category: 'Salads', price: 8 }
];

const mockWorldPizzaTourItems: WorldPizzaTourItem[] = [
  { id: 3, menu_item_id: 3, name: 'Test World Pizza', description: 'Test world pizza description', month: 'July', category: 'World Pizza Tour', price: 10 },
];

describe('MenuEditingComponent', () => {
  let component: MenuEditingComponent;
  let fixture: ComponentFixture<MenuEditingComponent>;
  let menuService: jasmine.SpyObj<MenuService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const menuServiceSpy = jasmine.createSpyObj('MenuService', [
      'updateMenuItem', 
      'loadMenuItems', 
      'loadWorldPizzaTour', 
      'combinedMenuItems$', 
      'updateWorldPizzaTourItem'
    ]);
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

    // Mock combinedMenuItems$ to return both menu items and world pizza tour items
    menuService.combinedMenuItems$ = of([...mockMenuItems, ...mockWorldPizzaTourItems]);
    menuService.loadMenuItems.and.returnValue(of(mockMenuItems));
    menuService.loadWorldPizzaTour.and.returnValue(of(mockWorldPizzaTourItems));
    menuService.updateMenuItem.and.returnValue(of({}));
    menuService.updateWorldPizzaTourItem.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items on ngOnInit', () => {
    expect(component.menuItems.length).toBe(3);
    expect(component.menuItems).toEqual([...mockMenuItems, ...mockWorldPizzaTourItems]);
  });

  it('should open dialog with menu item data when openEditMenuItemDialog is called', () => {
    const mockDialogRef = jasmine.createSpyObj('dialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(mockMenuItems[0]));
    dialog.open.and.returnValue(mockDialogRef);
  
    component.openEditMenuItemDialog(mockMenuItems[0]);
  
    expect(dialog.open).toHaveBeenCalledWith(EditMenuItemDialogComponent, {
      width: '600px',
      data: { menuItem: { ...mockMenuItems[0] }, isWorldPizzaTourItem: false }
    });
  });

  it('should update menu item on dialog close with result', fakeAsync(() => {
    const updatedMenuItem: MenuItem = { ...mockMenuItems[0], name: 'Updated Pizza' };
    const mockDialogRef = jasmine.createSpyObj('dialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of({ menuItem: updatedMenuItem, isWorldPizzaTourItem: false }));
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
    expect(itemElements.length).toBe(mockMenuItems.length + mockWorldPizzaTourItems.length);

    const allItems = [...mockMenuItems, ...mockWorldPizzaTourItems];
    allItems.forEach((item, index) => {
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