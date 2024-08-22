import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { AchievementList } from '../models/achievements';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/achievements';
  }

  getUserAchievements(userId: number): Observable<AchievementList> {
    return this.http.get<IJsonObject>(`${this.path}/users/${userId}`).pipe(
      map((achievements) => Deserialize(achievements, () => AchievementList)),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
