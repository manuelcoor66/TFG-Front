import { Component, inject } from '@angular/core';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    MatButton
  ]
})
export class ProfileComponent {
  private dialog = inject(MatDialog);

  public async openChangePasswordModal(): Promise<void> {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '36rem',
    });
  }
}
