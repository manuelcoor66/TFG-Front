import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportList } from '../models/sports';

@Injectable({
  providedIn: 'root',
})
export class SportsService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/sports';
  }

  getAllSports(): Observable<SportList> {
    return this.http.get<IJsonObject>(`${this.path}/all-sports`).pipe(
      map((sports) => Deserialize(sports, () => SportList)),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
