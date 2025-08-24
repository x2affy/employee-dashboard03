import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  private _usersCache: User[] = [];
  private _seed = 'employee-dashboard-demo'; // fixed seed = same users each fetch

  // Call this once if you want to change the seed dynamically
  setSeed(seed: string) { this._seed = seed; this._usersCache = []; }

  
  // 🔄 Generate a new random seed (forces new list)
  private regenerateSeed() {
    this._seed = Math.random().toString(36).substring(2, 10);
    this._usersCache = [];
  }

  // Fetch from API
  private fetchUsers(count = 10): Observable<User[]> {
    const url = `https://randomuser.me/api/?results=${count}&seed=${encodeURIComponent(this._seed)}`;
    return this.http.get<{ results: User[] }>(url).pipe(map(r => r.results));
  }

  // Public: get users from cache or fetch if empty
  getOrFetchUsers(): Observable<User[]> {
    if (this._usersCache.length) {
      return of(this._usersCache);
    }
    return this.fetchUsers().pipe(
      map(users => {
        this._usersCache = users;
        return users;
      })
    );
  }

  // For the detail page
  getByIdFromCache(id: string | null): User | undefined {
    if (!id) return undefined;
    return this._usersCache.find(u => u.login.uuid === id);
  }

  // 🔄 Force-refresh: clear cache + new seed + fetch fresh data
  refreshUsers(): Observable<User[]> {
    this.regenerateSeed();
    return this.fetchUsers().pipe(
      map(users => {
        this._usersCache = users;
        return users;
      })
    );
  }
}
