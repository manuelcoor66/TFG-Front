import { Component } from '@angular/core';
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [UsersTableComponent],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent {}
