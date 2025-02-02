import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService, MenuItem, WorldPizzaTourItem } from '../menu.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Pizza', description: 'Delicious pizza', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Salad', description: 'Healthy salad', category: 'Salads', price: 5 },
  { id: 3, name: 'Baklava', description: 'Sweet pastry', category: 'Sweet Endings', price: 3 },
];

const mockWorldPizzaTourItems: WorldPizzaTourItem[] = [
  { id: 4, menu_item_id: 4, name: 'World Pizza', description: 'Special pizza', month: 'July', category: 'World Pizza Tour', price: 10 },
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let compiled: HTMLElement;
  let menuService: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    menuService = jasmine.createSpyObj('MenuService', ['loadMenuItems', 'loadWorldPizzaTour', 'combinedMenuItems$']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MenuComponent],
      providers: [{ provide: MenuService, useValue: menuService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    // Mock combinedMenuItems$ to return both menu items and world pizza tour items
    menuService.combinedMenuItems$ = of([...mockMenuItems, ...mockWorldPizzaTourItems]);
    menuService.loadMenuItems.and.returnValue(of(mockMenuItems));
    menuService.loadWorldPizzaTour.and.returnValue(of(mockWorldPizzaTourItems));

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display menu items', () => {
    const menuItemElements = compiled.querySelectorAll('.menu-item');
    expect(menuItemElements.length).toBe(mockMenuItems.length + mockWorldPizzaTourItems.length);

    const allItems = [...mockMenuItems, ...mockWorldPizzaTourItems];
    allItems.forEach((menuItem, index) => {
      const element = menuItemElements[index];
      expect(element.querySelector('h3')?.textContent).toContain(menuItem.name);
      expect(element.querySelector('p:nth-child(2)')?.textContent).toContain(menuItem.description);
      expect(element.querySelector('.category')?.textContent).toContain(menuItem.category);
      if ('price' in menuItem) {
        expect(element.querySelector('.price')?.textContent).toContain(menuItem.price.toString());
      }
      if (component.isWorldPizzaTourItem(menuItem)) {
        expect(element.querySelector('.month')?.textContent).toContain(menuItem.month);
      }
    });
  });

  it('should unsubscribe from menuItems$ on destroy', () => {
    spyOn(component['menuItemsSubscription'], 'unsubscribe'); // Corrected: menuItemsSubscription
    component.ngOnDestroy();
    expect(component['menuItemsSubscription'].unsubscribe).toHaveBeenCalled(); // Corrected: menuItemsSubscription
  });
});