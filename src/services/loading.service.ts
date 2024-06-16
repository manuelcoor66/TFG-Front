import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  start(): void {
    this.loadingSubject.next(true);
  }

  stop(): void {
    this.loadingSubject.next(false);
  }
}
