import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionsDialogComponent } from './select-options-dialog.component';

describe('SelectOptionsDialogComponent', () => {
  let component: SelectOptionsDialogComponent;
  let fixture: ComponentFixture<SelectOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
