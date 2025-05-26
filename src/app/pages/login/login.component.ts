import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private http: HttpClient) {}

  login() {
  this.http.post<{ accessToken: string; user: any }>('/api/login', {
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));

      // Redirect based on role
      if (res.user.role === 'admin') {
        this.router.navigate(['/admin-profile', res.user.id]);
      } else {
        this.router.navigate(['/user-profile', res.user.id]);
      }
    },
     error: (err) => {
      console.error(err);
      alert('Login failed'); 
      }
    });
  }
}
