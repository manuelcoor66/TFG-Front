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

  getAllMatchesOfALeague(leagueId: number): Observable<MatchesList> {
    return this.http.get<IJsonObject>(`${this.path}/${leagueId}`).pipe(
      map((leagues) => Deserialize(leagues, () => MatchesList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getFinalizedLeagueMatches(leagueId: number): Observable<MatchesList> {
    return this.http
      .get<IJsonObject>(`${this.path}/finalized/league/${leagueId}`)
      .pipe(
        map((leagues) => Deserialize(leagues, () => MatchesList)),
        catchError((err) => {
          throw err;
        }),
      );
  }

  getActiveLeagueMatches(leagueId: number): Observable<MatchesList> {
    return this.http
      .get<IJsonObject>(`${this.path}/finalized/league/${leagueId}`)
      .pipe(
        map((leagues) => Deserialize(leagues, () => MatchesList)),
        catchError((err) => {
          throw err;
        }),
      );
  }
}
