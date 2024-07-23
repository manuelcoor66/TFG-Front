import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
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

@Component({
  selector: 'app-user-table',
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
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements AfterViewInit {
  private enrolmentService = inject(EnrolmentService);
  private route = inject(ActivatedRoute);

  displayedColumns: string[] = ['id', 'name', 'points', 'wins', 'defeats'];

  // dataSource = new MatTableDataSource<ClassificationTable>(
  //   CLASSIFICATION_DATA.sort((a, b) => b.points - a.points),
  // );
  dataSource = new MatTableDataSource<EnrolmentTable>();

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
        .subscribe((enrolments) => {
          this.dataSource.data = enrolments.items;
        });
    });
  }

  refreshData(): void {
    this.loadEnrolments();
  }
}
