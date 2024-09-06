import { Component, Input, inject } from '@angular/core';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  /**
   * Input data
   */
  @Input() data: string | undefined;

  constructor() {
    this.matIconRegistry.addSvgIcon(
      'block',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/block.svg',
      ),
    );
  }
}
