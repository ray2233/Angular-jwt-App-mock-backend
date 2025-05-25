import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { provideRouter } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'admin-profile/:id', component: AdminProfileComponent },
  { path: 'user-profile/:id', component: UserProfileComponent },
  { path: '**', redirectTo: 'login' }  
];

export const appRouter = provideRouter(appRoutes);