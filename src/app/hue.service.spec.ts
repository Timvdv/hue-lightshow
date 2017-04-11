import { TestBed, inject } from '@angular/core/testing';
import { HueService } from './hue.service';

describe('HueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HueService]
    });
  });

  it('should ...', inject([HueService], (service: HueService) => {
    expect(service).toBeTruthy();
  }));
});
