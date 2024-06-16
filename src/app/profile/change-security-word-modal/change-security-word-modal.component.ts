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
  templateUrl: './change-security-word-modal.component.html',
  styleUrls: ['./change-security-word-modal.component.scss'],
})
export class ChangeSecurityWordModalComponent {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  private localStorageService = inject(LocalStorageService);
  private dialog = inject(MatDialog);

  forgotSecurityWord = false;

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  /**
   * actual user data
   */
  public actualUser!: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { forgotSecurityWord: boolean },
  ) {
    this.forgotSecurityWord = this.data?.forgotSecurityWord;
    this.actualUser = this.localStorageService.getItem('user');

    this.loginForm = new FormGroup({
      checkForm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      newSecurityWord: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newSecurityWordRepeat', true),
        // matchValidator(user.password as string, true),
      ]),
      newSecurityWordRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('newSecurityWord'),
      ]),
    });
  }

  changeSecurityWord(): void {
    if (this.loginForm.valid) {
      if (
        (this.forgotSecurityWord &&
          this.actualUser.securityWord ==
            this.loginForm.get('checkForm')?.value) ||
        (!this.forgotSecurityWord &&
          this.actualUser.password == this.loginForm.get('checkForm')?.value)
      ) {
        this.userService
          .changeSecurityWord(
            this.actualUser.email as string,
            this.loginForm.get('newSecurityWord')?.value,
          )
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message, 'success');
              throw err;
            }),
          )
          .subscribe();
        this.actualUser.securityWord =
          this.loginForm.get('newSecurityWord')?.value;
        this.localStorageService.setItem('user', this.actualUser);
        this.snackbarService.openSnackBar(
          'Palabra de seguridad cambiada con éxito',
          'success',
        );
        this.dialog.closeAll();
      } else {
        this.snackbarService.openSnackBar(
          this.forgotSecurityWord
            ? 'La palabra de seguridad actual no existe o la introducida es la actual'
            : 'La contraseña introducida es incorrecta',
          'warning',
        );
      }
    }
  }
}
