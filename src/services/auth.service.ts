import { Injectable, inject } from '@angular/core';
import { EnrolmentList } from '../models/enrolment';
import { LocalStorageService } from './local-storage.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);

  private readonly userToken = 'user';
  private readonly enrolmentToken = 'enrolments';

  constructor() {}

  login(user: User, enrolmentList: EnrolmentList): void {
    this.localStorageService.setItem(this.userToken, user);
    this.localStorageService.setItem(this.enrolmentToken, enrolmentList.items);
  }

  logout(): void {
    this.localStorageService.removeItem(this.userToken);
    this.localStorageService.removeItem(this.enrolmentToken);
  }

  isLoggedIn(): boolean {
    return this.localStorageService.getItem(this.userToken) !== null;
  }
}
