import { TestBed } from '@angular/core/testing';

import { AuthResolverService } from './auth-resolver.service';

describe('AuthResolverService', () => {
  let service: AuthResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
