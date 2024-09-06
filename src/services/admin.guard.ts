import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {UserRoleName} from "../utils/enum";

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  canActivate(): boolean | UrlTree {
    const currentUser = this.localStorageService.getItem('user');

    if (currentUser.role !== UserRoleName.ADMIN.valueOf()) {
      this.router.navigate([this.router.url]);

      return false;
    } else {
      return true;
    }
  }
}
