import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

// Mock AuthService
class MockAuthService {
  currentUser$ = of(null);
  isLoggedIn$ = of(false);
  logout() {}
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'When Worlds Collide Pizza' title`, () => {
    expect(component.title).toEqual('When Worlds Collide Pizza');
  });

  it('should render the app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('When Worlds Collide Pizza');
  });

  it('should toggle the mobile menu', () => {
    expect(component.showMenu).toBe(false);
    component.toggleMenu();
    expect(component.showMenu).toBe(true);
    component.toggleMenu();
    expect(component.showMenu).toBe(false);
  });

  it('should logout the user', () => {
    spyOn(authService, 'logout');
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should update isLoggedIn and currentUsername on initialization', () => {
    const mockUsername = 'testuser';
    const mockIsLoggedIn = true;

    // Update the mock service observables
    (authService as any).currentUser$ = of(mockUsername);
    (authService as any).isLoggedIn$ = of(mockIsLoggedIn);

    // Re-initialize the component
    component.ngOnInit();

    expect(component.currentUsername).toEqual(mockUsername);
    expect(component.isLoggedIn).toEqual(mockIsLoggedIn);
  });
});