import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { ChangeSecurityWordModalComponent } from './change-security-word-modal/change-security-word-modal.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
  ],
})
export class ProfileComponent implements OnInit {
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private localStorageService = inject(LocalStorageService);
  private snackbarService = inject(SnackbarService);

  /**
   * User updated data
   */
  actualuser!: User;

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.actualuser = this.localStorageService.getItem('user');

    this.loginForm = new FormGroup({
      name: new FormControl({ value: this.actualuser?.name, disabled: false }, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      lastNames: new FormControl(
        { value: this.actualuser?.lastNames, disabled: false },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ),
      email: new FormControl({ value: this.actualuser?.email, disabled: true }),
    });
  }

  public async openChangePasswordModal(): Promise<void> {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '36rem',
      data: { forgotPassword: false },
    });
  }

  public async openChangeSecurityPasswordModal(): Promise<void> {
    this.dialog.open(ChangeSecurityWordModalComponent, {
      width: '36rem',
      data: { forgotSecurityWord: true },
    });
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      if (
        this.actualuser.name !== this.loginForm.get('name')?.value ||
        this.actualuser.lastNames !== this.loginForm.get('lastNames')?.value
      ) {
        this.userService
          .modifyUser(
            this.actualuser.email,
            this.loginForm.get('name')?.value,
            this.loginForm.get('lastNames')?.value,
            this.actualuser.password,
            this.actualuser.securityWord,
          )
          .pipe(
            catchError((err) => {
              this.snackbarService.openSnackBar(err.error.message, 'warning');
              throw err;
            }),
          )
          .subscribe(() => {
            this.actualuser.name = this.loginForm.get('name')?.value;
            this.actualuser.lastNames = this.loginForm.get('lastNames')?.value;
            this.localStorageService.setItem('user', this.actualuser);
            this.snackbarService.openSnackBar(
              'Datos cambiados con éxito',
              'success',
            );
          });
      } else {
        this.snackbarService.openSnackBar('Cambie algún dato', 'warning');
      }
    }
  }
}
