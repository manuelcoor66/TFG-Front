import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { UserByStateRoleList } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-change-user-state-modal',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './change-user-state-modal.component.html',
  styleUrls: ['./change-user-state-modal.component.scss'],
})
export class ChangeUserStateModalComponent {
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ChangeUserStateModalComponent>);

  /**
   * User form
   */
  public userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { users: UserByStateRoleList; ban: boolean },
  ) {
    this.userForm = new FormGroup({
      user: new FormControl('', Validators.required),
    });
  }

  changeState(): void {
    if (this.userForm.valid) {
      this.userService
        .changeUserState(this.userForm.get('user')?.value)
        .subscribe(() => {
          this.dialogRef.close(true);
        });

      this.dialogRef.close();
    }
  }
}
