import { Deserialize, IJsonObject } from 'dcerialize';
import { Matches, MatchesList } from '../models/matches';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    winPlayer1: boolean,
    winPlayer2: boolean,
    winPlayer3?: boolean,
    winPlayer4?: boolean,
  ): Observable<Matches> {
    return this.http
      .post<Matches>(
        `${this.path}/add-result?match_id=${matchId}&result=${result}&win_player_1=${winPlayer1}` +
              `&win_player_2=${winPlayer2}&win_player_3=${winPlayer3}&win_player_4=${winPlayer4}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
