import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-search-bar',
    imports: [CommonModule, FormsModule],
    template: `
    <!-- Two-way bind a local value, emit changes to parent -->
    <input
      type="search"
      [placeholder]="placeholder || 'Search...'"
      [(ngModel)]="value"
      (ngModelChange)="valueChange.emit($event)"
      style="margin-bottom: 1rem; padding: 6px; width: 100%; max-width: 300px;"
      aria-label="Search"
    />
  `
})
export class SearchBarComponent {
    @Input() value = '';
    @Input() placeholder = 'Search...';
    @Output() valueChange = new EventEmitter<string>();
}
