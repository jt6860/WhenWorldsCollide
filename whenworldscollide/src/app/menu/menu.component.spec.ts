import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService } from '../menu.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock MenuService
const mockMenuService = {
  menuItems$: of([]) // Initially, the observable emits an empty array
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, HttpClientTestingModule],
      providers: [{ provide: MenuService, useValue: mockMenuService }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});