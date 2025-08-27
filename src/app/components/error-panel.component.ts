import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-error-panel',
  imports: [CommonModule],
  template: `
    <div class="error" *ngIf="message">
      <div>
        <strong>We couldn’t load employees.</strong>
        <div class="muted">{{ message }}</div>
      </div>
      <button (click)="retry.emit()">Retry</button>
    </div>
  `,
  styles: [`
    .error { display:flex; justify-content:space-between; align-items:center; gap:12px;
      padding:12px; border:1px solid #f5c2c7; background:#f8d7da; color:#58151c;
      border-radius:8px; margin-bottom:12px; }
    .muted { color:#666; }
  `]
})
export class ErrorPanelComponent {
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();
}
