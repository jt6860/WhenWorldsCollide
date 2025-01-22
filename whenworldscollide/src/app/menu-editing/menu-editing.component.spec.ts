import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEditingComponent } from './menu-editing.component';

describe('MenuEditingComponent', () => {
  let component: MenuEditingComponent;
  let fixture: ComponentFixture<MenuEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEditingComponent]
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
