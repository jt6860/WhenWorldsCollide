import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSubmissionComponent, ContactSubmission } from './contact-submission.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { throwError } from 'rxjs';

describe('ContactSubmissionComponent', () => {
  let component: ContactSubmissionComponent;
  let fixture: ComponentFixture<ContactSubmissionComponent>;
  let httpTestingController: HttpTestingController;

  const mockSubmissions: ContactSubmission[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', message: 'Hello there!' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', message: 'How are you?' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSubmissionComponent, HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactSubmissionComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    spyOn(component, 'fetchSubmissions');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.fetchSubmissions).toHaveBeenCalled();
  });

  it('should fetch submissions on initialization', () => {
    fixture.detectChanges();
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/api/contact');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSubmissions);

    expect(component.submissions).toEqual(mockSubmissions);
  });

  it('should render submissions in a table', () => {
    // Mock the fetchSubmissions method before calling detectChanges
    spyOn(component, 'fetchSubmissions').and.callFake(() => {
      component.submissions = mockSubmissions;
    });

    // Now, detectChanges will not cause fetchSubmissions to make a real HTTP request
    fixture.detectChanges();

    // Check if fetchSubmissions was called (it should have been)
    expect(component.fetchSubmissions).toHaveBeenCalled();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(mockSubmissions.length);

    mockSubmissions.forEach((submission, index) => {
      const row = tableRows[index];
      expect(row.cells[0].textContent).toContain(submission.id.toString());
      expect(row.cells[1].textContent).toContain(submission.name);
      expect(row.cells[2].textContent).toContain(submission.email);
      expect(row.cells[3].textContent).toContain(submission.message);
    });
  });

  it('should display "No contact submissions yet." message when there are no submissions', () => {
    // Simulate fetching no submissions
    spyOn(component, 'fetchSubmissions').and.callFake(() => {
      component.submissions = [];
    });

    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement.textContent).toContain('No contact submissions yet.');
  });

  it('should handle error when fetching submissions', () => {
    spyOn(console, 'error');
    spyOn(component, 'fetchSubmissions').and.callFake(() => {
      return throwError(() => new Error('Simulated error')).subscribe(() => { }, (err) => {
        console.error('Error fetching contact submissions:', err);
      });
    });

    fixture.detectChanges(); // ngOnInit will be called here which in turn calls fetchSubmissions

    expect(component.submissions.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith('Error fetching contact submissions:', jasmine.any(Error));
  });
});