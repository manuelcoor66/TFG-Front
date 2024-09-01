import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { EnrolmentService } from '../../services/enrolment.service';
import { HashService } from '../../services/hash.service';
import { LoadingService } from '../../services/loading.service';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';
import { UserStateName } from '../../utils/enum';
import { catchError } from 'rxjs';
import { emailRegex } from '../../utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
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
export class LoginComponent {
  private loading = inject(LoadingService);
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService);
  private hashService = inject(HashService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private enrolmentService = inject(EnrolmentService);

  /**
   * Login form
   */
  public loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(emailRegex),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      this.loading.start();
      this.userService
        .getUserByEmail(this.loginForm.get('email')?.value)
        .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message, 'warning');
            throw err;
          }),
        )
        .subscribe((user) => {
          if (user.state?.valueOf() === UserStateName.AVAILABLE) {
            if (
              this.hashService.comparePassword(
                this.loginForm.get('password')?.value,
                user.password as string,
              )
            ) {
              this.enrolmentService
                .getUserEnrolments(user.id as number)
                .subscribe((enrolmentList) => {
                  this.authService.login(user, enrolmentList);
                });
              this.router.navigateByUrl('/home');
            }
          } else {
            this.snackbarService.openSnackBar(
              'El usuario no puede loggearse porque esa banneado',
              'warning',
            );
          }
        });
    }
  }
}
