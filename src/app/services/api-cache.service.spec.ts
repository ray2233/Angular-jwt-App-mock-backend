import { TestBed } from '@angular/core/testing';
import { ApiCacheService } from './api-cache.service';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ApiCacheService', () => {
  let service: ApiCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCacheService);
  });

  it('should return fetched data and cache it', fakeAsync(() => {
  const fetchFn = jasmine.createSpy().and.returnValue(of('value1'));

  const result1$ = service.getOrSet<string>('test-key', fetchFn);
  let result1: string | undefined;

  result1$.subscribe(res => (result1 = res));
  tick();

  expect(result1).toBe('value1');
  expect(fetchFn).toHaveBeenCalledTimes(1);

  const result2$ = service.getOrSet<string>('test-key', fetchFn);
  let result2: string | undefined;

  result2$.subscribe(res => (result2 = res));
  tick();

  expect(result2).toBe('value1');
  expect(fetchFn).toHaveBeenCalledTimes(1); 
}));


  it('should evict errored cache entries', fakeAsync(() => {
  const fetchFn = jasmine.createSpy().and.returnValue(throwError(() => new Error('Fail')));
  const result$ = service.getOrSet<string>('error-key', fetchFn);

  result$.subscribe({ error: () => {} });
  tick();

  // retry after error
  const fetchFn2 = jasmine.createSpy().and.returnValue(of('recovered'));
  const recovered$ = service.getOrSet<string>('error-key', fetchFn2);

  let final: string | undefined;
  recovered$.subscribe(res => (final = res));
  tick();

  expect(final).toBe('recovered');
  expect(fetchFn2).toHaveBeenCalledTimes(1);
}));

  it('should clear specific cache key', () => {
    const fetchFn = jasmine.createSpy().and.returnValue(of('value'));
    service.getOrSet('a', fetchFn);
    service.clear('a');

    const fetchFn2 = jasmine.createSpy().and.returnValue(of('value2'));
    const result$ = service.getOrSet('a', fetchFn2);
    result$.subscribe(val => expect(val).toBe('value2'));
  });

  it('should clear all cache when no key passed', () => {
    const fetchFn = jasmine.createSpy().and.returnValue(of('x'));
    service.getOrSet('x1', fetchFn);
    service.getOrSet('x2', fetchFn);
    service.clear();

    const fetchFn2 = jasmine.createSpy().and.returnValue(of('y'));
    const result$ = service.getOrSet('x1', fetchFn2);
    result$.subscribe(val => expect(val).toBe('y'));
  });
});
