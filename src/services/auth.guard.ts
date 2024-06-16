import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);

      return false;
    } else {
      return true;
    }
  }
}
