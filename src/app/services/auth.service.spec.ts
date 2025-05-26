import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const dummyToken = 'fake-jwt-token';

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'fake-jwt-token');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in and store token', (done) => {
  const http = TestBed.inject(HttpTestingController);
  service.login({ email: 'test@example.com', password: '123456' }).subscribe(() => {
    expect(localStorage.getItem('jwt_token')).toBe('fake-jwt-token');
    done();
  });

  const req = http.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: 'fake-jwt-token', user: { email: 'test@example.com' } });
  });

  it('should clear token on logout', () => {
    localStorage.setItem('jwt_token', dummyToken);
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should return false for isLoggedIn if no token', () => {
    localStorage.removeItem('jwt_token');

    const service = TestBed.inject(AuthService);
    expect(service.isLoggedIn()).toBeFalse();
});

it('should expose user observable', () => {
    localStorage.setItem('jwt_token', 'fake-jwt-token');
    const service = TestBed.inject(AuthService);

    service.getUser().subscribe(user => {
      expect(user).toEqual({ token: 'fake-jwt-token' });
    });
  });
});
