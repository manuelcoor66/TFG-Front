import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
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

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  /**
   * actual user data
   */
  public actualUser!: User;

  constructor() {
    this.userService.getUser(40).subscribe((user) => {
      this.actualUser = user;

      this.loginForm = new FormGroup({
        oldPassword: new FormControl('', [
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
    });
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      if (
        this.actualUser.password == this.loginForm.get('oldPassword')?.value
      ) {
        this.actualUser.password = this.loginForm.get('newPassword')?.value;
      } else {
        this.snackbarService.openSnackBar(
          'La contraseña actual no existe o la introducida es la actual',
        );
      }
    }
  }
}
