import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { User } from './../models/user.model';            // updated path
import { UserService } from './../services/user.service'; // updated path

@Component({
  standalone: true,
  selector: 'app-user-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/">← Back</a>
    <h2>Employee Details</h2>

    <!-- If we found the user in cache, show it -->
    <ng-container *ngIf="user; else notFound">
      <p>Name: {{ user.name.first }} {{ user.name.last }}</p>
      <p>Email: {{ user.email }}</p>
      <img *ngIf="user.picture?.large" [src]="user.picture.large" alt="photo">
    </ng-container>

    <!-- If not in cache (e.g., you refreshed on the detail URL), tell the user to go back -->
    <ng-template #notFound>
      <p>User not found. Try going back to the list and clicking Details again.</p>
    </ng-template>
  `
})
export class UserDetailComponent {
  user?: User;

  constructor(route: ActivatedRoute, private service: UserService) {
    // Grab the :id from the URL and look it up from the cached list
    const id = route.snapshot.paramMap.get('id');
    this.user = this.service.getByIdFromCache(id);
  }
}
