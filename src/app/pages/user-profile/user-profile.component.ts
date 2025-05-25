import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>User Profile</h2>
    <div *ngIf="user">
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Role: {{ user.role }}</p>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  user: any;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`/api/users/${id}`).subscribe(res => {
      this.user = res;
    });
  }
}
