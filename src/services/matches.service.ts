import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatchesList } from '../models/matches';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/matches';
  }

  getAllMatchesOfALeague(league_id: number): Observable<MatchesList> {
    return this.http.get<IJsonObject>(`${this.path}/${league_id}`).pipe(
      map((leagues) => Deserialize(leagues, () => MatchesList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getFinalizedLeagueMatches(league_id: number): Observable<MatchesList> {
    return this.http
      .get<IJsonObject>(`${this.path}/finalized/league/${league_id}`)
      .pipe(
        map((leagues) => Deserialize(leagues, () => MatchesList)),
        catchError((err) => {
          throw err;
        }),
      );
  }

  getActiveLeagueMatches(league_id: number): Observable<MatchesList> {
    return this.http
      .get<IJsonObject>(`${this.path}/finalized/league/${league_id}`)
      .pipe(
        map((leagues) => Deserialize(leagues, () => MatchesList)),
        catchError((err) => {
          throw err;
        }),
      );
  }
}
