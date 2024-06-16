import {inject, Injectable} from '@angular/core';
import { User } from "../models/user";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);

  private readonly TOKEN_KEY = 'user';

  constructor() { }

  login(user: User): void {
    this.localStorageService.setItem(this.TOKEN_KEY, user);
  }

  logout(): void {
    this.localStorageService.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.localStorageService.getItem(this.TOKEN_KEY) !== null;
  }
}
