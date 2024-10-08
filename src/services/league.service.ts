import { Deserialize, IJsonObject } from 'dcerialize';
import { HttpClient, HttpParams } from '@angular/common/http';
import { League, LeagueList } from '../models/league';
import { Observable, catchError, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { formatDate } from '../utils/shared-functions';

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

  getAllLeagues(search?: string): Observable<LeagueList> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<IJsonObject>(`${this.path}/search`, { params }).pipe(
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
    sport: number,
    price: number,
  ): Observable<League> {
    return this.http
      .post<League>(
        `${this.path}/create-league?name=${name}&description=${description}
        &created_by=${createdBy}&points_victory=${pointsVictory}&place=${place}
        &sport_id=${sport}&points_defeat=${pointsDefeat}&weeks=${weeks}&date_start=${dateStart}&price=${price}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  modifyLeague(league: League, date: Date): Observable<void> {
    const formattedDate = formatDate(date);

    return this.http
      .patch<void>(
        `${this.path}/modify-league?id=${league.id}&name=${league.name}&description=${league.description}
        &points_victory=${league.pointsVictory}&points_defeat=${league.pointsDefeat}&weeks=${league.weeks}
        &date_start=${formattedDate}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
