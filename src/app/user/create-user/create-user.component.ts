import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, TranslateModule, MatButton, ReactiveFormsModule, NgIf],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
  /**
   * Login form
   */
  public loginForm: FormGroup;

  private EMAIL_REGEX = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(.*[!@#$%^&*+=\\\\?\\-<>|(){}\'\\";:/€].*)');

  constructor(
    private userService: UserService,
  ) {


    this.loginForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastnames: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.EMAIL_REGEX),
        this.matchValidator('password_repeat', true)
      ]),
      password_repeat: new FormControl('', [
        Validators.required,
        this.matchValidator('password')
      ]),
      security_word: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  matchValidator(matchTo: string, original?: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && original) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }

      return null;
    }

    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
  }

  /**
   * Mothod to login an user
   */
  login(): void {
    if (this.loginForm.valid) {
      const user = new User(
          this.loginForm.get('name')?.value,
          this.loginForm.get('lastnames')?.value,
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value,
          this.loginForm.get('security_word')?.value
        )
      // this.loginForm.disable();
      this.userService.createUser(user).subscribe()
    }
  }
}
