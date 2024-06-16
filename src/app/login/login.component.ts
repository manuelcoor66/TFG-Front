import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import {HashService} from "../../services/hash.service";
import { Router } from '@angular/router';
import { User } from '../../models/user';

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

  /**
   * Login form
   */
  public loginForm: FormGroup;

  private emailRegex = new RegExp(
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  );

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
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
      console.log(this.loginForm.get('password')?.value)
      this.userService.getUserByEmail(this.loginForm.get('email')?.value)
       .pipe(
          catchError((err) => {
            this.snackbarService.openSnackBar(err.error.message);
            throw err;
          }),
        )
        .subscribe((user)=> {
          console.log(user.password as string)
          console.log(this.loginForm.get('password')?.value)
          console.log(this.hashService.comparePassword(this.loginForm.get('password')?.value, user.password as string));
          if (this.hashService.comparePassword(this.loginForm.get('password')?.value, user.password as string)) {
            this.authService.login(user);
            this.router.navigateByUrl('/home')
          }
        });
    }
  }
}
