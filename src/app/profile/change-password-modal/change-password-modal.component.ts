import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { HashService } from '../../../services/hash.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { catchError } from 'rxjs';
import { matchValidator } from '../../utils/functions';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  private localStorageService = inject(LocalStorageService);
  private dialog = inject(MatDialog);
  private hashService = inject(HashService);

  forgotPassword = false;

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  /**
   * actual user data
   */
  public actualUser!: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { forgotPassword: boolean },
  ) {
    this.forgotPassword = this.data?.forgotPassword;
    this.actualUser = this.localStorageService.getItem('user');

    this.loginForm = new FormGroup({
      checkForm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newPasswordRepeat', true),
        // matchValidator(user.password as string, true),
      ]),
      newPasswordRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newPassword'),
      ]),
    });
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      if (
        (!this.forgotPassword &&
          this.hashService.comparePassword(
            this.loginForm.get('checkForm')?.value,
            this.actualUser.password as string,
          )) ||
        (this.forgotPassword &&
          this.actualUser.securityWord ==
            this.loginForm.get('checkForm')?.value)
      ) {
        this.userService
          .changePassword(
            this.actualUser.email as string,
            this.hashService.hashPassword(
              this.loginForm.get('newPassword')?.value,
            ),
          )
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message, 'success');
              throw err;
            }),
          )
          .subscribe();
        this.actualUser.password = this.hashService.hashPassword(
          this.loginForm.get('newPassword')?.value,
        );
        this.localStorageService.setItem('user', this.actualUser);
        this.snackbarService.openSnackBar(
          'Contraseña cambiada con éxito',
          'success',
        );
        this.dialog.closeAll();
      } else {
        this.snackbarService.openSnackBar(
          this.forgotPassword
            ? 'La contraseña actual no existe o la introducida es la actual'
            : 'La palabra de seguridad introducida es incorrecta',
          'warning',
        );
      }
    }
  }
}
