import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FavouritesService } from './services/favourites.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <h1>Employee Dashboard</h1>
    <nav>
      <a routerLink="/">Home</a>&nbsp;
      <a routerLink="/favourites">Favourites ({{ favCount }})</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

    constructor(private favs: FavouritesService) {}

  // Recomputed each change detection
  get favCount() { return this.favs.all().length; }

}
