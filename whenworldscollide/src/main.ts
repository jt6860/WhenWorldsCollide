// main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { AppModule } from './app/module/app.module'; // Import AppModule

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(AppModule) // Import providers from AppModule
  ]
})
  .catch((err) => console.error(err));