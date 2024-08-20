import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Matches, MatchesList } from '../models/matches';

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
      .get<IJsonObject>(`${this.path}/active/league/${leagueId}`)
      .pipe(
        map((leagues) => Deserialize(leagues, () => MatchesList)),
        catchError((err) => {
          throw err;
        }),
      );
  }

  addMatchResult(
    matchId: number,
    result: string,
    win_player_1: boolean,
    win_player_2: boolean,
    win_player_3?: boolean,
    win_player_4?: boolean,
  ): Observable<Matches> {
    return this.http
      .post<Matches>(
        `${this.path}/add-result?match_id=${matchId}&result=${result}&win_player_1=${win_player_1}&win_player_2=${win_player_2}&win_player_3=${win_player_3}&win_player_4=${win_player_4}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
