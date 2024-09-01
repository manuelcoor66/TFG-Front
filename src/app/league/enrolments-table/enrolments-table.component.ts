import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { EnrolmentService } from '../../../services/enrolment.service';
import { EnrolmentTable } from '../../../models/enrolment';
import { MatPaginator } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { NoDataComponent } from '../../shared-components/no-data/no-data.component';

@Component({
  selector: 'app-enrolments-table',
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
    MatHeaderCellDef,
    NgIf,
    NoDataComponent,
  ],
  templateUrl: './enrolments-table.component.html',
  styleUrls: ['./enrolments-table.component.scss'],
})
export class EnrolmentsTableComponent implements AfterViewInit {
  private enrolmentService = inject(EnrolmentService);
  private route = inject(ActivatedRoute);

  /**
   * Displayed columns
   */
  displayedColumns: string[] = ['id', 'name', 'points', 'wins', 'defeats'];

  /**
   * Data source
   */
  dataSource = new MatTableDataSource<EnrolmentTable>();

  /**
   * Whether is empty
   */
  isEmpty = true;

  /**
   * Message to show if is empty
   */
  emptyData = 'No existen usuarios, vuelva a intentarlo más tarde';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.loadEnrolments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEnrolments(): void {
    this.route.params.subscribe((params) => {
      this.enrolmentService
        .getLeagueEnrolmentsTable(params['id'])
        .pipe(
          catchError(() => {
            this.isEmpty = true;

            return EMPTY;
          }),
        )
        .subscribe((enrolments) => {
          this.dataSource.data = enrolments.items;
          this.isEmpty = enrolments.total === 0;
        });
    });
  }

  refreshData(): void {
    this.loadEnrolments();
  }
}
