// contact-submissions.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact-submission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-submission.component.html',
  styleUrls: ['./contact-submission.component.css']
})
export class ContactSubmissionComponent implements OnInit {
  submissions: ContactSubmission[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.http.get<ContactSubmission[]>('http://127.0.0.1:3000/api/contact')
      .subscribe({
        next: (data) => {
          this.submissions = data;
        },
        error: (error) => {
          console.error('Error fetching contact submissions:', error);
        }
      });
  }
}