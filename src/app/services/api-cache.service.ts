import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

interface CachedEntry<T> {
  value$: Observable<T>;
  expiry: number;
}

@Injectable({ providedIn: 'root' })
export class ApiCacheService {
  private cache = new Map<string, CachedEntry<any>>();

  /**
   * Returns cached value if valid; otherwise fetches and caches a new one.
   * @param key Unique cache key
   * @param fetchFn Function that returns the observable (e.g., HTTP call)
   * @param ttlMs Time-to-live in milliseconds
   */
  getOrSet<T>(key: string, fetchFn: () => Observable<T>, ttlMs = 5 * 60 * 1000): Observable<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && now < cached.expiry) {
      return cached.value$;
    }

    const value$ = fetchFn().pipe(
      shareReplay(1),
      tap({
        error: () => {
          // Remove errored cache so future attempts can retry
          this.cache.delete(key);
        }
      })
    );

    this.cache.set(key, {
      value$,
      expiry: now + ttlMs
    });

    return value$;
  }

  /**
   * Manually clear a specific cache key or all cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
