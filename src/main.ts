import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/pages/home/home.component';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

// bootstrapApplication(AppComponent, {
//   providers: [provideRouter(routes), ...appConfig.providers]
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), ...appConfig.providers,
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ]
});
