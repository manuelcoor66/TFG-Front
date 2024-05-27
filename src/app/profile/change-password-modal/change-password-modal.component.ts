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
import {SnackbarService} from "../../../services/snackbar.service";

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [FormsModule, MatButton, MatError, MatFormField, MatInput, MatLabel, NgIf, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  private userService = inject(UserService);
  private snackbarService = inject(SnackbarService)

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
      console.log(this.actualUser)

      this.loginForm = new FormGroup({
        old_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8)
        ]),
        new_password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          matchValidator('new_password_repeat', true),
          // matchValidator(user.password as string, true),
        ]),
        new_password_repeat: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          matchValidator('new_password'),
        ]),
      });
    })
  }

  changePassword(): void {
    if (this.loginForm.valid) {
      if (this.actualUser.password == this.loginForm.get('old_password')?.value) {
        this.actualUser.password = this.loginForm.get('new_password')?.value
      }
      else {
        this.snackbarService.openSnackBar('La contraseña actual no existe o la introducida es la actual');
      }
    }
  }
}
