import { Component, inject } from '@angular/core';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-general-modal',
  standalone: true,
  imports: [MatIcon, MatButton, NgIf],
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss'],
})
export class GeneralModalComponent {
  private dialogRef = inject(MatDialogRef<GeneralModalComponent>);
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'report',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/report.svg',
      ),
    );
  }

  closeModal(data: string): void {
    this.dialogRef.close(data);
  }
}
