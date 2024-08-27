import { Component, Inject, inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserByStateRole } from '../../../models/user';
import { UserRole } from '../../../utils/enum';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-change-user-role-modal',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
  ],
  templateUrl: './change-user-role-modal.component.html',
  styleUrls: ['./change-user-role-modal.component.scss'],
})
export class ChangeUserRoleModalComponent {
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ChangeUserRoleModalComponent>);
  private snackbarService = inject(SnackbarService);

  /**
   * User form
   */
  public userForm: FormGroup;

  /**
   *
   */
  userRolesList: { id: string; name: UserRole }[];

  /**
   *
   * @param data
   */

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { users: UserByStateRole[] },
  ) {
    this.userForm = new FormGroup({
      user: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });

    this.userRolesList = Object.keys(UserRole).map((key) => ({
      id: key,
      name: UserRole[key as keyof typeof UserRole],
    }));
  }

  changeUserRole(): void {
    if (this.userForm.valid) {
      this.userService
        .changeUserRole(
          this.userForm.get('user')?.value,
          this.userForm.get('role')?.value,
        )
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');

            return EMPTY;
          }),
        )
        .subscribe(() => {
          this.dialogRef.close(true);
        });

      this.dialogRef.close();
    }
  }
}
