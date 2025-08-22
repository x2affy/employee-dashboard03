import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, User } from './user.service';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Employees</h2>
    <ul>
      <li *ngFor="let u of users">
        <img [src]="u.picture.thumbnail" alt="photo">
        {{ u.name.first }} {{ u.name.last }}
        <a [routerLink]="['/employee', u.login.uuid]">Details</a>
        <button (click)="toggleFavourite(u)">★</button>
      </li>
    </ul>

    <h3>Favourites</h3>
    <ul>
      <li *ngFor="let f of favourites">
        {{ f.name.first }} {{ f.name.last }}
      </li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  favourites: User[] = [];

  constructor(private service: UserService) {}

  ngOnInit() {
    // Fetch employees once and cache them in the service
    this.service.getUsers().subscribe({
      next: data => {
        this.users = data.results;
        this.service.setCache(this.users); // <-- cache for the detail page
      },
      error: () => {
        // minimal: ignore for now (no-frills)
      }
    });
  }

  toggleFavourite(user: User) {
    if (this.favourites.includes(user)) {
      this.favourites = this.favourites.filter(f => f !== user);
    } else {
      this.favourites.push(user);
    }
  }
}
