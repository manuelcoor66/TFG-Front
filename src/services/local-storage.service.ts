import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Enrolment } from '../models/enrolment';
import { League } from '../models/league';
import { User } from '../models/user';
import { UserTicket } from '../models/ticket';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const testKey = '__test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);

    return true;
  }

  setItem(
    key: string,
    value: User | League[] | Enrolment[] | UserTicket[],
  ): void {
    if (this.isLocalStorageAvailable()) {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    }
  }

  getItem(key: string): any {
    if (this.isLocalStorageAvailable()) {
      const value = localStorage.getItem(key);

      return value ? JSON.parse(value) : null;
    }
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }
}
