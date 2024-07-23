import { Deserialize, IJsonObject } from 'dcerialize';
import { League, LeagueList } from '../models/league';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/league';
  }

  getAllLeagues(): Observable<LeagueList> {
    return this.http.get<IJsonObject>(`${this.path}/league-list`).pipe(
      map((leagues) => Deserialize(leagues, () => LeagueList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueByName(name: string): Observable<League> {
    return this.http.get<IJsonObject>(`${this.path}/name/${name}`).pipe(
      map((leagues) => Deserialize(leagues, () => League)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueById(id: number): Observable<League> {
    return this.http.get<IJsonObject>(`${this.path}/${id}`).pipe(
      map((leagues) => Deserialize(leagues, () => League)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  deleteLeagueById(id: number): Observable<object> {
    return this.http.delete(`${this.path}/id/${id}`);
  }

  createLeague(
    name: string,
    description: string,
    createdBy: number,
    pointsVictory: number,
    pointsDefeat: number,
    weeks: number,
    dateStart: string,
    place: number,
  ): Observable<League> {
    return this.http
      .post<League>(
        `${this.path}/create-league?name=${name}&description=${description}
        &created_by=${createdBy}&points_victory=${pointsVictory}&place=${place}
        &points_defeat=${pointsDefeat}&weeks=${weeks}&date_start=${dateStart}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
