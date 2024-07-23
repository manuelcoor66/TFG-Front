import { Deserialize, IJsonObject } from 'dcerialize';
import {
  Enrolment,
  EnrolmentList,
  EnrolmentTableList,
} from '../models/enrolment';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    leagueId: number,
    userId: number,
    paid: boolean,
  ): Observable<Enrolment> {
    return this.http
      .post<Enrolment>(
        `${this.path}/create_enrolment?user_id=${userId}&league_id=${leagueId}&paid=${paid}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  getUserEnrolments(userId: number): Observable<EnrolmentList> {
    return this.http.get<IJsonObject>(`${this.path}/user/${userId}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueEnrolments(leagueId: number): Observable<EnrolmentList> {
    return this.http.get<IJsonObject>(`${this.path}/league/${leagueId}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getLeagueEnrolmentsTable(leagueId: number): Observable<EnrolmentTableList> {
    return this.http.get<IJsonObject>(`${this.path}/table/${leagueId}`).pipe(
      map((enrolments) => Deserialize(enrolments, () => EnrolmentTableList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  finalizeEnrolment(
    leagueId: number,
    userId: number,
  ): Observable<EnrolmentList> {
    return this.http
      .put<EnrolmentList>(
        `${this.path}/finalize_enrolment?user_id=${userId}&league_id=${leagueId}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
