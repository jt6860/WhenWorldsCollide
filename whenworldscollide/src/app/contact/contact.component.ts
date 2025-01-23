import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact', // Component selector used in HTML
  standalone: true, // Marks the component as standalone
  // List of imported modules used by this component
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html', // Path to the component's HTML template
  styleUrls: ['./contact.component.css'] // Path to the component's CSS styles
})
export class ContactComponent {
  contactForm!: FormGroup; // FormGroup for the contact form
  responseMessage: string = ''; // Message to display after form submission

  // Constructor with FormBuilder and HttpClient injection
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the contact form with form controls and validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name field (required)
      email: ['', [Validators.required, Validators.email]], // Email field (required, email format)
      message: ['', Validators.required] // Message field (required)
    });
  }

  // Method called when the form is submitted
  onSubmit(event: Event): void {
    event.preventDefault();
    // Check if the form is valid
    if (this.contactForm.valid) {
      // Send a POST request to the /api/contact endpoint with the form data
      this.http.post('http://localhost:3000/api/contact', this.contactForm.value).subscribe({
        next: (response: any) => {
          // On successful submission, display a success message and reset the form
          this.responseMessage = 'Your message has been sent successfully!';
          this.contactForm.reset();
        },
        error: (error) => {
          // On error, log the error to the console and display an error message
          console.error('Error submitting the form:', error);
          this.responseMessage = 'There was an error sending your message. Please try again later.';
        },
      });
    } else {
      // If the form is invalid, display an error message
      this.responseMessage = 'Please fill out all fields before submitting.';
    }
  }
}