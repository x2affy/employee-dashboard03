// The list page with:
// - a search box to filter employees
// - loading skeletons + error + retry
// - favourites toggle
// - a Refresh button to intentionally regenerate a new list

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from './../models/user.model';
import { UserService } from './../services/user.service';
import { FavouritesService } from './../services/favourites.service';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Title row with Refresh button -->
    <h2 style="display:flex; justify-content:space-between; align-items:center;">
      Employees
      <button (click)="refreshList()">Refresh</button>
    </h2>

    <!-- Search input bound to 'filter' property -->
    <input
      type="search"
      placeholder="Search by name..."
      [(ngModel)]="filter"
      style="margin-bottom: 1rem; padding: 6px; width: 100%; max-width: 300px;"
    />

    <!-- Top loading bar -->
    <div class="top-loader" *ngIf="loading"></div>

    <!-- Error panel with Retry -->
    <div class="error" *ngIf="error">
      <div>
        <strong>We couldn't load employees.</strong>
        <div class="muted">{{ error }}</div>
      </div>
      <button (click)="loadUsers()">Retry</button>
    </div>

    <!-- Skeletons while loading -->
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

    <!-- Loaded state: shows the filtered list of employees -->
    <ul *ngIf="!loading && !error" class="list">
      <li *ngFor="let u of filteredUsers" class="row">
        <img [src]="u.picture.thumbnail" alt="photo" class="avatar">
        <span class="name">{{ u.name.first }} {{ u.name.last }}</span>
        <a [routerLink]="['/employee', u.login.uuid]">Details</a>
        <!-- Favourite toggle (★ if favourite, ☆ if not) -->
        <button (click)="toggleFavourite(u)" [attr.aria-pressed]="isFavourite(u) ? 'true' : 'false'">
          {{ isFavourite(u) ? '★' : '☆' }}
        </button>
      </li>
      <li *ngIf="!filteredUsers.length" class="muted">No employees match your search.</li>
    </ul>

    <!-- Favourites list -->
    <h3>Favourites</h3>
    <ul class="list small">
      <li *ngFor="let f of favouriteUsers" class="row">
        <span class="name">{{ f.name.first }} {{ f.name.last }}</span>
      </li>
      <li *ngIf="!favouriteUsers.length" class="muted">No favourites yet.</li>
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
  users: User[] = [];        // list of employees
  loading = false;           // true while fetching
  error = '';                // error message text
  skeletons = Array.from({ length: 8 }); // fake rows for skeleton loading
  filter = '';               // search input text

  constructor(
    private usersSvc: UserService,
    private favs: FavouritesService
  ) {}

  ngOnInit() {
    this.loadUsers(); // fetch or reuse cached users
  }

  // Normal load (cache-or-fetch)
  loadUsers() {
    this.loading = true;
    this.error = '';
    this.usersSvc.getOrFetchUsers().subscribe({
      next: (list) => { this.users = list; this.loading = false; },
      error: () => { this.error = 'Please check your internet connection and try again.'; this.loading = false; }
    });
  }

  // 🔄 Refresh button: force new seed + new list
  refreshList() {
    this.loading = true;
    this.error = '';
    this.usersSvc.refreshUsers().subscribe({
      next: (list) => { this.users = list; this.loading = false; },
      error: () => { this.error = 'Could not refresh employees.'; this.loading = false; }
    });
  }

  // Apply search filter
  get filteredUsers(): User[] {
    if (!this.filter.trim()) return this.users;
    const term = this.filter.toLowerCase();
    return this.users.filter(u =>
      `${u.name.first} ${u.name.last}`.toLowerCase().includes(term)
    );
  }

  // Favourites via service
  toggleFavourite(u: User) { this.favs.toggle(u.login.uuid); }
  isFavourite(u: User) { return this.favs.isFavourite(u.login.uuid); }

  // Build a list of favourite users (subset of current users)
  get favouriteUsers(): User[] {
    const favIds = new Set(this.favs.all());
    return this.users.filter(u => favIds.has(u.login.uuid));
  }
}
