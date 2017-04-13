import { TestBed, inject } from '@angular/core/testing';
import { JamendoService } from './jamendo.service';

describe('JamendoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JamendoService]
    });
  });

  it('should ...', inject([JamendoService], (service: JamendoService) => {
    expect(service).toBeTruthy();
  }));
});
