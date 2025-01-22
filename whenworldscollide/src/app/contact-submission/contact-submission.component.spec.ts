import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSubmissionComponent } from './contact-submission.component';

describe('ContactSubmissionComponent', () => {
  let component: ContactSubmissionComponent;
  let fixture: ComponentFixture<ContactSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
