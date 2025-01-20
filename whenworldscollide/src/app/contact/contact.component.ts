import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html', // Correct path
  styleUrls: ['./contact.component.css'], // Ensure the CSS file exists
})
export class ContactComponent {
  contactForm: FormGroup;
  responseMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: [''],
      email: [''],
      message: [''],
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
          this.responseMessage =
            'There was an error sending your message. Please try again later.';
        },
      });
    } else {
      this.responseMessage = 'Please fill out all fields before submitting.';
    }
  }
}
