import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model'; // updated path

@Injectable({ providedIn: 'root' })

export class UserService {
  constructor(private http: HttpClient) {}

  // Simple in-memory cache of the last fetched users
  private _usersCache: User[] = [];
  setCache(users: User[]) { this._usersCache = users; }
  getFromCache(): User[] { return this._usersCache; }
  getByIdFromCache(id: string | null): User | undefined {
    if (!id) return undefined;
    return this._usersCache.find(u => u.login.uuid === id);

  }

  // Get 10 users from the API
  getUsers() {
    return this.http.get<{ results: User[] }>(
      'https://randomuser.me/api/?results=10'
    );
  }
}
