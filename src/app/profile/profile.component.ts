import { Component, inject } from '@angular/core';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private dialog = inject(MatDialog);

  public async openChangePasswordModal(): Promise<void> {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '36rem',
    });
  }
}
