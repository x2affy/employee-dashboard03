// Shows: loading skeletons + a loading bar while fetching,
// and a friendly error panel with a Retry button if the API fails.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from './../models/user.model';
import { UserService } from './../services/user.service';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Employees</h2>

    <!-- Top loading bar (simple, visible only while loading) -->
    <div class="top-loader" *ngIf="loading"></div>

    <!-- Error panel with Retry -->
    <div class="error" *ngIf="error">
      <div>
        <strong>We couldn't load employees.</strong>
        <div class="muted">{{ error }}</div>
      </div>
      <button (click)="loadUsers()">Retry</button>
    </div>

    <!-- Loading state: show skeleton placeholders -->
    <ul *ngIf="loading && !error" class="list">
      <li *ngFor="let i of skeletons" class="row">
        <div class="avatar skeleton"></div>
        <div class="col">
          <div class="line skeleton"></div>
          <div class="line skeleton short"></div>
        </div>
        <div class="btn skeleton"></div>
      </li>
    </ul>

    <!-- Loaded state -->
    <ul *ngIf="!loading && !error" class="list">
      <li *ngFor="let u of users" class="row">
        <img [src]="u.picture.thumbnail" alt="photo" class="avatar">
        <span class="name">{{ u.name.first }} {{ u.name.last }}</span>
        <a [routerLink]="['/employee', u.login.uuid]">Details</a>
        <button (click)="toggleFavourite(u)" aria-label="Toggle favourite">★</button>
      </li>
    </ul>

    <h3>Favourites</h3>
    <ul class="list small">
      <li *ngFor="let f of favourites" class="row">
        <span class="name">{{ f.name.first }} {{ f.name.last }}</span>
      </li>
      <li *ngIf="!favourites.length" class="muted">No favourites yet.</li>
    </ul>
  `,
  styles: [`
    /* Layout */
    .list { list-style: none; padding: 0; margin: 0 0 1rem; display: grid; gap: 8px; }
    .list.small .row { padding: 6px 0; }
    .row { display: grid; grid-template-columns: 36px 1fr auto auto; gap: 8px; align-items: center; padding: 8px; border: 1px solid #eee; border-radius: 8px; }
    .name { font-weight: 500; }
    .avatar { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; background: #ddd; }
    .btn { width: 48px; height: 28px; border-radius: 6px; }
    .col { display: grid; gap: 6px; }
    .muted { color: #666; }

    /* Error panel */
    .error { display: flex; justify-content: space-between; align-items: center; gap: 12px;
             padding: 12px; border: 1px solid #f5c2c7; background: #f8d7da; color: #58151c;
             border-radius: 8px; margin-bottom: 12px; }

    /* Top loading bar */
    .top-loader { height: 3px; width: 100%; background: linear-gradient(90deg,#9ec5fe,#86efac,#f8b4d9);
                  animation: pulse 1.1s infinite ease-in-out; margin: 6px 0 12px; }
    @keyframes pulse { 0% { opacity:.6 } 50% { opacity:1 } 100% { opacity:.6 } }

    /* Skeletons */
    .skeleton { position: relative; overflow: hidden; background: #eee; }
    .line { height: 10px; border-radius: 6px; }
    .line.short { width: 40%; }
    .skeleton::after {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
      transform: translateX(-100%); animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  favourites: User[] = [];

  loading = false;      // true while fetching
  error = '';           // error message (empty means no error)
  skeletons = Array.from({ length: 8 }); // 8 skeleton rows

  constructor(private service: UserService) {}

  ngOnInit() {
    this.loadUsers(); // fetch on first load
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    this.service.getUsers().subscribe({
      next: (data) => {
        this.users = data.results;
        this.service.setCache(this.users); // keep for detail page
        this.loading = false;
      },
      error: () => {
        this.error = 'Please check your internet connection and try again.';
        this.loading = false;
      }
    });
  }

  toggleFavourite(user: User) {
    this.favourites = this.favourites.includes(user)
      ? this.favourites.filter(f => f !== user)
      : [...this.favourites, user];
  }
}
