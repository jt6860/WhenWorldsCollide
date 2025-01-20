import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Use only provideHttpClient
import { FormsModule } from '@angular/forms'; // Add FormsModule for form handling
import { CommonModule } from '@angular/common'; // Required for directives like *ngIf
import { AppComponent } from '../app.component'; // Root component
import { ContactComponent } from '../contact/contact.component'; // Contact component

@NgModule({
  imports: [
    BrowserModule, // Required for Angular applications
    FormsModule, // Required for template-driven forms
    CommonModule, // Required for structural directives like *ngIf
    AppComponent, // Import standalone AppComponent
    ContactComponent, // Import standalone ContactComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // HTTP Interceptors
  ],
  bootstrap: [AppComponent], // Bootstrap the root component
})
export class AppModule { }
