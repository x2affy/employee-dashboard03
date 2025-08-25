// A page that shows only favourite employees.
// It reads favourite IDs from FavouritesService
// and maps them to the current user list from UserService’s cache.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { User } from './../models/user.model';
import { UserService } from './../services/user.service';
import { FavouritesService } from './../services/favourites.service';

@Component({
  standalone: true,
  selector: 'app-favourites',
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Favourites</h2>
    <p class="muted">Only employees you have starred (★) will appear here.</p>

    <ul class="list">
      <li *ngFor="let u of favouriteUsers" class="row">
        <img [src]="u.picture.thumbnail" alt="photo" class="avatar">
        <span class="name">{{ u.name.first }} {{ u.name.last }}</span>
        <a [routerLink]="['/employee', u.login.uuid]">Details</a>
        <button (click)="toggleFavourite(u)" [attr.aria-pressed]="isFavourite(u) ? 'true' : 'false'">
          {{ isFavourite(u) ? '★' : '☆' }}
        </button>
      </li>
      <li *ngIf="!favouriteUsers.length" class="muted">No favourites yet.</li>
    </ul>

    <a routerLink="/">← Back to all employees</a>
  `,
  styles: [`
    .list { list-style: none; padding: 0; margin: 1rem 0; display: grid; gap: 8px; }
    .row  { display: grid; grid-template-columns: 36px 1fr auto auto; gap: 8px; align-items: center; padding: 8px; border: 1px solid #eee; border-radius: 8px; }
    .avatar { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; background: #ddd; }
    .name { font-weight: 500; }
    .muted { color: #666; }
  `]
})

export class FavouritesPage {
  constructor(
    private usersSvc: UserService,
    private favs: FavouritesService
  ) {}

  // Build the favourites list from the user cache + favourite IDs
  get favouriteUsers(): User[] {
    const favIds = new Set(this.favs.all());
    
    // We show favourites that exist in the current cached list
    // (see note below about refresh/seed for keeping them present)
    return (this.usersSvc as any)._usersCache?.filter((u: User) => favIds.has(u.login.uuid)) ?? [];
  }

  isFavourite(u: User) { return this.favs.isFavourite(u.login.uuid); }
  toggleFavourite(u: User) { this.favs.toggle(u.login.uuid); }
}
