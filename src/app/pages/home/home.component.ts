import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCacheService } from '../../services/api-cache.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { DashboardData } from '../../models/dashboard-data.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CommonModule,
  MatCardModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private apiCache = inject(ApiCacheService);
  private http = inject(HttpClient);

  // jsonString = 'Welome to the Dashboard';

  data$ = this.apiCache.getOrSet<DashboardData>(
    'dashboard-data',
    () => this.http.get<DashboardData>('/api/home'),
    30000
  );
  castToDashboardData(data: unknown): DashboardData {
    return data as DashboardData;
  }
}
