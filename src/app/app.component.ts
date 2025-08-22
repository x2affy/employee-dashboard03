import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <h1>Employee Dashboard</h1>
    <nav>
      <a routerLink="/">Home</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
