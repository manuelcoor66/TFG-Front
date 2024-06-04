import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { catchError } from 'rxjs';
import { matchValidator } from '../../utils/functions';

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
  private snackbarService = inject(SnackbarService);

  /**
   * Login form
   */
  public loginForm: FormGroup;

  private emailRegex = new RegExp(
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  );

  constructor() {
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastnames: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        matchValidator('passwordRepeat', true),
      ]),
      passwordRepeat: new FormControl('', [
        Validators.required,
        matchValidator('password'),
      ]),
      securityWord: new FormControl('', [Validators.required]),
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
        this.loginForm.get('securityWord')?.value,
      );
      // this.loginForm.disable();
      this.userService
        .createUser(user)
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'success');
            throw err;
          }),
        )
        .subscribe();
    }
  }
}
