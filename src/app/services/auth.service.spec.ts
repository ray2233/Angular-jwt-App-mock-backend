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

  it('should log in and store token', () => {
    const credentials = { email: 'test@example.com', password: '123456' };
    service.login(credentials).subscribe(res => {
      expect(res.token).toBe(dummyToken);
      expect(service.getToken()).toBe(dummyToken);
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: dummyToken });
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

  it('should expose user observable', (done) => {
  localStorage.setItem('jwt_token', 'fake-jwt-token'); 

  const service = TestBed.inject(AuthService);
  service.getUser().subscribe(user => {
    expect(user).toEqual({ token: 'fake-jwt-token' });
    done();
    });
  });
});
