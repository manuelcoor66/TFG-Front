import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import {
  Enrolment,
  EnrolmentList,
  EnrolmentTableList,
} from '../models/enrolment';
import { Deserialize, IJsonObject } from 'dcerialize';

@Injectable({
  providedIn: 'root',
})
export class EnrolmentService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/enrolments';
  }

  createEnrolment(
    league_id: number,
    user_id: number,
    paid: boolean,
  ): Observable<Enrolment> {
    return this.http
      .post<Enrolment>(
        `${this.path}/create_enrolment?user_id=${user_id}&league_id=${league_id}&paid=${paid}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  getUserEnrolments(user_id: number): Observable<EnrolmentList> {
    return this.http.get<IJsonObject>(`${this.path}/user/${user_id}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueEnrolments(league_id: number): Observable<EnrolmentList> {
    return this.http.get<IJsonObject>(`${this.path}/league/${league_id}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueEnrolmentsTable(league_id: number): Observable<EnrolmentTableList> {
    return this.http.get<IJsonObject>(`${this.path}/table/${league_id}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentTableList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  finalizeEnrolment(
    league_id: number,
    user_id: number,
  ): Observable<EnrolmentList> {
    return this.http
      .put<EnrolmentList>(
        `${this.path}/finalize_enrolment?user_id=${user_id}&league_id=${league_id}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
