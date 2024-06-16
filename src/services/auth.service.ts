import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);

  private readonly tokenKey = 'user';

  constructor() {}

  login(user: User): void {
    this.localStorageService.setItem(this.tokenKey, user);
  }

  logout(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.localStorageService.getItem(this.tokenKey) !== null;
  }
}
