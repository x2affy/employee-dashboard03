import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-top-loader',
  imports: [CommonModule],
  template: `<div class="top-loader" *ngIf="show"></div>`,
  styles: [`
    .top-loader { height: 3px; width: 100%;
      background: linear-gradient(90deg,#9ec5fe,#86efac,#f8b4d9);
      animation: pulse 1.1s infinite ease-in-out; margin: 6px 0 12px; }
    @keyframes pulse { 0% { opacity:.6 } 50% { opacity:1 } 100% { opacity:.6 } }
  `]
})
export class TopLoaderComponent {
  @Input() show = false;
}
