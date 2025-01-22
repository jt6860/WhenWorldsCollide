import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenuService } from '../menu.service';
import { of } from 'rxjs';

const mockMenuService = {
  menuItems$: of([])
};

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderComponent, HttpClientTestingModule],
      providers: [{ provide: MenuService, useValue: mockMenuService }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});