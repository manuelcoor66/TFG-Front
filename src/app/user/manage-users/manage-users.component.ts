import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { ChangeUserRoleModalComponent } from '../change-user-role-modal/change-user-role-modal.component';
import { ChangeUserStateModalComponent } from '../change-user-state-modal/change-user-state-modal.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { UserByStateRoleList } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UserStateName } from '../../../utils/enum';
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [UsersTableComponent, MatButton, MatIcon, NgIf],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})

export class ManageUsersComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private cdRef = inject(ChangeDetectorRef);

  @ViewChild(UsersTableComponent) userTable!: UsersTableComponent;

  /**
   * Banned users
   */
  bannedUsers = new UserByStateRoleList([], 0);

  /**
   * Banned users
   */
  availableUsers = new UserByStateRoleList([], 0);

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.userService
      .getUsersByState(UserStateName.BANNED)
      .subscribe((users) => {
        this.bannedUsers = users;
      });
    this.userService
      .getUsersByState(UserStateName.AVAILABLE)
      .subscribe((users) => {
        this.availableUsers = users;
      });
  }

  openChangeUserState(users: UserByStateRoleList, ban: boolean): void {
    const dialogRef = this.dialog.open(ChangeUserStateModalComponent, {
      width: '36rem',
      data: {
        users: users,
        ban: ban,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data == true) {
        this.userTable.refreshData();

        this.loadData();
        this.cdRef.detectChanges();
      }
    });
  }

  openChangeUseRole(): void {
    const combinedUsers = [
      ...this.availableUsers.items,
      ...this.bannedUsers.items,
    ];

    const dialogRef = this.dialog.open(ChangeUserRoleModalComponent, {
      width: '36rem',
      data: {
        users: combinedUsers,
      },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data == true) {
        this.userTable.refreshData();

        this.loadData();
        this.cdRef.detectChanges();
      }
    });
  }
}
