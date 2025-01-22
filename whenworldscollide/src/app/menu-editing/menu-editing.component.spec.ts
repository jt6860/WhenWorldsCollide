import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuEditingComponent } from './menu-editing.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../menu.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock MatDialog
const mockMatDialog = {
  open: () => ({
    afterClosed: () => of(true)
  })
};

// Mock MenuService
const mockMenuService = {
  menuItems$: of([]),
  updateMenuItem: () => of({})
};

describe('MenuEditingComponent', () => {
  let component: MenuEditingComponent;
  let fixture: ComponentFixture<MenuEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEditingComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MenuService, useValue: mockMenuService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});