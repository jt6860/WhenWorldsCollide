import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
          imports: [HttpClientTestingModule], // Include in imports
          providers: [MenuService]
        });
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
