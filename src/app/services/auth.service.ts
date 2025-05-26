
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtTokenKey = 'jwt_token';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  const token = this.getToken();
  if (token) {
    this.userSubject.next({ token });
  }
}

  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post<{ accessToken: string; user: any }>('/api/login', credentials).pipe(
    tap(res => {
      localStorage.setItem(this.jwtTokenKey, res.accessToken);
      this.userSubject.next({ token: res.accessToken, user: res.user });
    })
  );
}

  logout() {
    localStorage.removeItem(this.jwtTokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey); 
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }
}
