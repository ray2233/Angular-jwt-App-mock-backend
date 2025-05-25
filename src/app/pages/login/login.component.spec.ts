import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on successful login', () => {
    authServiceSpy.login.and.returnValue(of({}));
    component.email = 'test@example.com';
    component.password = 'password';
    component.login();
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should alert on login error', () => {
    spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid')));
    component.email = 'fail@example.com';
    component.password = 'wrong';
    component.login();
    expect(window.alert).toHaveBeenCalledWith('Login failed');
  });
});
