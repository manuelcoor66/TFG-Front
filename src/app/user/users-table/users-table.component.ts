import { Component, ViewChild, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { NoDataComponent } from '../../shared-components/no-data/no-data.component';
import { UserTable } from '../../../models/user';
import { EMPTY, catchError } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserRole, UserState } from '../../../utils/enum';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    NoDataComponent,
    MatHeaderCellDef,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent {
  private userService = inject(UserService);

  displayedColumns: string[] = ['name', 'email', 'role', 'state'];

  dataSource = new MatTableDataSource<UserTable>();

  /**
   * Whether is empty
   */
  isEmpty = true;

  emptyData = 'No existen usuarios, vuelva a intentarlo más tarde';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.loadEnrolments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEnrolments(): void {
    this.userService
      .getLeagueEnrolmentsTable()
      .pipe(
        catchError(() => {
          this.isEmpty = true;

          return EMPTY;
        }),
      )
      .subscribe((users) => {
        this.dataSource.data = users.items;
        this.isEmpty = users.total === 0;
      });
  }

  getRoleValue(role: keyof typeof UserRole): string {
    return UserRole[role];
  }

  getStateValue(state: keyof typeof UserState): string {
    return UserState[state];
  }

  refreshData(): void {
    this.loadEnrolments();
  }

  protected readonly UserState = UserState;
  protected readonly UserRole = UserRole;
}
