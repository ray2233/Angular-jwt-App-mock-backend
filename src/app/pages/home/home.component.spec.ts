import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiCacheService } from '../../services/api-cache.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiCacheServiceSpy: jasmine.SpyObj<ApiCacheService>;

  beforeEach(() => {
    apiCacheServiceSpy = jasmine.createSpyObj('ApiCacheService', ['getOrSet']);

    TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
      providers: [
        { provide: ApiCacheService, useValue: apiCacheServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ApiCacheService.getOrSet with key "dashboard-data"', () => {
    const mockData = { message: 'Welcome' };
    apiCacheServiceSpy.getOrSet.and.returnValue(of(mockData));

    fixture.detectChanges();

    expect(apiCacheServiceSpy.getOrSet).toHaveBeenCalledWith(
      'dashboard-data',
      jasmine.any(Function),
      30000 
    );
  });
});
