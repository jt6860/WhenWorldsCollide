import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Interface to define the structure of a ContactSubmission object
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact-submission', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  imports: [CommonModule], // List of imported modules used by this component
  templateUrl: './contact-submission.component.html', // Path to the component's HTML template
  styleUrls: ['./contact-submission.component.css'] // Path to the component's CSS styles
})
export class ContactSubmissionComponent implements OnInit {
  submissions: ContactSubmission[] = []; // Array to store contact submissions

  // Constructor with HttpClient injection
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Fetch contact submissions when the component initializes
    this.fetchSubmissions();
  }

  // Method to fetch contact submissions from the API
  fetchSubmissions(): void {
    // Send a GET request to the /api/contact endpoint
    this.http.get<ContactSubmission[]>('http://127.0.0.1:3000/api/contact')
      .subscribe({
        next: (data) => {
          // On successful response, update the submissions array with the received data
          this.submissions = data;
        },
        error: (error: HttpErrorResponse) => {
          // On error, log the error to the console
          console.error('Error fetching contact submissions:', error);
        }
      });
  }
}