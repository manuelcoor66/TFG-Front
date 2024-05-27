import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { matchValidator } from '../../utils/functions';
import {catchError} from "rxjs";
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButton,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService)

  /**
   * Login form
   */
  public loginForm: FormGroup;

  private EMAIL_REGEX = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(.*[!@#$%^&*+=\\\\?\\-<>|(){}\'\\";:/€].*)',
  );

  constructor() {
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastnames: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.EMAIL_REGEX)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('password_repeat', true),
      ]),
      password_repeat: new FormControl('', [
        Validators.required,
        matchValidator('password'),
      ]),
      security_word: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Mothod to login an user
   */
  createUser(): void {
    if (this.loginForm.valid) {
      const user = new User(
        this.loginForm.get('name')?.value,
        this.loginForm.get('lastnames')?.value,
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value,
        this.loginForm.get('security_word')?.value,
      );
      // this.loginForm.disable();
      this.userService.createUser(user)
        .pipe(
          catchError((err) => {
           this.snackbarService.openSnackBar(err)
          throw err;
        }),
        )
        .subscribe();
    }
  }
}
