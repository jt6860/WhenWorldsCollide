import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // Import ReactiveFormsModule and HttpClientModule here!
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm!: FormGroup;
  responseMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Add validators
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.contactForm.valid) {
      this.http.post('http://localhost:3000/api/contact', this.contactForm.value).subscribe({
        next: (response: any) => {
          this.responseMessage = 'Your message has been sent successfully!';
          this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error submitting the form:', error);
          this.responseMessage = 'There was an error sending your message. Please try again later.';
        },
      });
    } else {
      this.responseMessage = 'Please fill out all fields before submitting.';
    }
  }
}