// app.module.ts

import { NgModule } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 

@NgModule({
  imports: [
    HttpClientModule 
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()) 
  ]
})
export class AppModule { }