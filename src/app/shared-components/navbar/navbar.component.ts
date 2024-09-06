import { Component, inject } from '@angular/core';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '../../../services/local-storage.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserRoleName } from '../../../utils/enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, MatMenuTrigger, MatIcon, MatMenu],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private router = inject(Router);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);
  private localStorageService = inject(LocalStorageService);

  /**
   * Current user data
   */
  currentUser?: User;

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/delete.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'),
    );

    this.currentUser = this.localStorageService.getItem('user');
  }

  showNavbar(): boolean {
    return (
      this.router.url.includes('create-user') ||
      this.router.url.includes('login')
    );
  }

  goTo(text: string): void {
    window.location.href = text;
  }

  exit(): void {
    this.localStorageService.clear();
    this.router.navigateByUrl('/login');
  }

  protected readonly userRoleName = UserRoleName;
}
