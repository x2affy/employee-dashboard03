import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from './../models/user.model';
import { UserService } from './../services/user.service';
import { FavouritesService } from './../services/favourites.service';

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
      <button (click)="toggleFav()" [attr.aria-pressed]="isFav ? 'true' : 'false'">
        {{ isFav ? '★ Favourite' : '☆ Add to favourites' }}
      </button>
    </ng-container>

    <ng-template #notFound>
      <p>User not found. Go back to the list and click Details again.</p>
    </ng-template>
  `
})
export class UserDetailComponent {
  user?: User;
  isFav = false;

  constructor(route: ActivatedRoute, private users: UserService, private favs: FavouritesService) {
    
    // Grab the :id from the URL and look it up from the cached list
    const id = route.snapshot.paramMap.get('id');
    const found = this.users.getByIdFromCache(id);
  
    if (found) {
      this.user = found;
      this.isFav = this.favs.isFavourite(found.login.uuid);
    }
  }

  toggleFav() {
    if (!this.user) return;
    this.favs.toggle(this.user.login.uuid);
    this.isFav = this.favs.isFavourite(this.user.login.uuid);
  }
}
