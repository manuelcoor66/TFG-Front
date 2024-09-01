import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
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
import { UserRole, UserState } from '../../../utils/enum';
import { MatPaginator } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { NoDataComponent } from '../../shared-components/no-data/no-data.component';
import { UserService } from '../../../services/user.service';
import { UserTable } from '../../../models/user';

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
export class UsersTableComponent implements AfterViewInit, OnChanges {
  private userService = inject(UserService);
  private cdRef = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['name', 'email', 'role', 'state'];
  dataSource = new MatTableDataSource<UserTable>();

  isEmpty = true;
  emptyData = 'No existen usuarios, vuelva a intentarlo más tarde';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() searchTerm: string = '';

  constructor() {
    this.loadEnrolments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.applyFilter();
    }
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

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        this.applyFilter();

        this.cdRef.detectChanges();
      });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    this.isEmpty = this.dataSource.filteredData.length === 0;
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
}
