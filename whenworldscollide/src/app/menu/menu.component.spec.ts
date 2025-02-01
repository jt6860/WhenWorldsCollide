import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService, MenuItem } from '../menu.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Pizza', description: 'Delicious pizza', category: 'Pizzas', price: 10 },
  { id: 2, name: 'Salad', description: 'Healthy salad', category: 'Salads', price: 5 },
  { id: 3, name: 'Baklava', description: 'Sweet pastry', category: 'Sweet Endings', price: 3 },
];

const mockMenuService = {
  menuItems$: of(mockMenuItems),
  loadMenuItems: () => of(mockMenuItems)
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MenuComponent],
      providers: [{ provide: MenuService, useValue: mockMenuService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display menu items', () => {
    const menuItemElements = compiled.querySelectorAll('.menu-item');
    expect(menuItemElements.length).toBe(mockMenuItems.length);

    mockMenuItems.forEach((menuItem, index) => {
      const element = menuItemElements[index];
      expect(element.querySelector('h3')?.textContent).toContain(menuItem.name);
      expect(element.querySelector('p:nth-child(2)')?.textContent).toContain(menuItem.description);
      expect(element.querySelector('.category')?.textContent).toContain(menuItem.category);
      expect(element.querySelector('.price')?.textContent).toContain(menuItem.price.toString());
    });
  });

  it('should unsubscribe from menuItems$ on destroy', () => {
    spyOn(component['menuItemsSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['menuItemsSubscription'].unsubscribe).toHaveBeenCalled();
  });
});