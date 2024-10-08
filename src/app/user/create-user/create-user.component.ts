import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HashService } from '../../../services/hash.service';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { catchError } from 'rxjs';
import { emailRegex } from '../../../utils/utils';
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
  private hashService = inject(HashService);
  private router = inject(Router);

  /**
   * Login form
   */
  public loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastnames: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(emailRegex),
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
        this.loginForm.get('email')?.value,
        this.loginForm.get('name')?.value,
        this.loginForm.get('lastnames')?.value,
        this.hashService.hashPassword(this.loginForm.get('password')?.value),
        this.loginForm.get('securityWord')?.value,
      );
      this.userService
        .createUser(user)
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'success');
            throw err;
          }),
        )
        .subscribe(() => {
          this.snackbarService.openSnackBar(
            'Usuario creado con éxito',
            'success',
          );
          this.router.navigateByUrl('/leagues');
        });
    }
  }
}
