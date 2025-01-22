import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuItemDialogComponent } from './edit-menu-item-dialog.component';

describe('EditMenuItemDialogComponent', () => {
  let component: EditMenuItemDialogComponent;
  let fixture: ComponentFixture<EditMenuItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMenuItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMenuItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
