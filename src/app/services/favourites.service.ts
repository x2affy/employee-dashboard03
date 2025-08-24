//Keeps favourites in a central place that survives page changes and refreshes.
//Saves to localStorage so it persists across reloads.

import { Injectable } from '@angular/core';

const KEY = 'favourites_v1';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  // store UUIDs of favourite users
  private ids = new Set<string>();

  constructor() {
    // load from localStorage
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { JSON.parse(raw).forEach((id: string) => this.ids.add(id)); } catch {}
    }
  }

  private persist() {
    localStorage.setItem(KEY, JSON.stringify(Array.from(this.ids)));
  }

  isFavourite(id: string): boolean {
    return this.ids.has(id);
  }

  toggle(id: string) {
    if (this.ids.has(id)) this.ids.delete(id); else this.ids.add(id);
    this.persist();
  }

  all(): string[] {
    return Array.from(this.ids);
  }
}
