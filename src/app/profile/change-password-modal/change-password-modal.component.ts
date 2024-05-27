import {Component, inject} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { matchValidator } from '../../utils/functions';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [FormsModule, MatButton, MatError, MatFormField, MatInput, MatLabel, NgIf, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  private userService = inject(UserService);

  /**
   * Login form
   */
  public loginForm!: FormGroup;

  /**
   * actual user data
   */
  public actualUser!: User;

  private EMAIL_REGEX = new RegExp(
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(.*[!@#$%^&*+=\\\\?\\-<>|(){}\'\\";:/€].*)',
  );

  constructor() {
    this.userService.getUser(40).subscribe((user) => {
      // console.log(user)
      // this.actualUser = user;

      this.loginForm = new FormGroup({
        old_password: new FormControl('', Validators.required),
        new_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.EMAIL_REGEX),
          matchValidator('new_password_repeat', true),
          // matchValidator(user.password as string, true),
        ]),
        new_password_repeat: new FormControl('', [
          Validators.required,
          matchValidator('new_password'),
        ]),
      });
    })
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      const user = new User(
        this.loginForm.get('name')?.value,
        this.loginForm.get('lastnames')?.value,
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value,
        this.loginForm.get('security_word')?.value,
      );
      // this.loginForm.disable();
      console.log(user)
      this.userService.createUser(user).subscribe();
    }
  }
}
