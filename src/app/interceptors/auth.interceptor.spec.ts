import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([AuthInterceptor]) 
        ), 
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useValue: AuthInterceptor,
          multi: true
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add Authorization header when token exists', () => {
    authServiceSpy.getToken.and.returnValue('abc123');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('should handle 401 and logout + navigate to login', () => {
    authServiceSpy.getToken.and.returnValue('abc123');

    http.get('/api/test').subscribe({
      next: () => fail('Should error with 401'),
      error: () => {
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
