import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert on login error', fakeAsync(() => {
    spyOn(window, 'alert');

    component.email = 'fail@example.com';
    component.password = 'wrong';
    component.login();

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'), { status: 401 }); 

    tick();

    expect(window.alert).toHaveBeenCalledWith('Login failed');
  }));
});