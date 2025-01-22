import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the welcome message', () => {
    const welcomeMessage = compiled.querySelector('section > h2');
    expect(welcomeMessage?.textContent).toContain('Welcome to When Worlds Collide Pizza');
  });

  it('should render the introductory paragraphs', () => {
    const paragraphs = compiled.querySelectorAll('section > p');
    expect(paragraphs.length).toBe(3); // Ensure there are 3 paragraphs

    expect(paragraphs[0]?.textContent).toContain('Embark on a culinary journey');
    expect(paragraphs[1]?.textContent).toContain('From the simplicity of a classic Neapolitan Margherita');
    expect(paragraphs[2]?.textContent).toContain('But the adventure doesn\'t stop there!');
  });

});