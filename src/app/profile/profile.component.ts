import { Component, OnInit, inject } from '@angular/core';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [MatButton],
})
export class ProfileComponent implements OnInit {
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private localStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    this.userService.getUser(48).subscribe((user) => {
      this.localStorageService.setItem('user', user);
    });
  }

  public async openChangePasswordModal(): Promise<void> {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '36rem',
    });
  }
}
