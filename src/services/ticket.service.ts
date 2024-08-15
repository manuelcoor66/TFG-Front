import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { UserTicket, UserTicketList } from '../models/ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/ticket';
  }

  getUserTicket(userId: number): Observable<UserTicketList> {
    return this.http.get<IJsonObject>(`${this.path}/user/${userId}`).pipe(
      map((tickets) => Deserialize(tickets, () => UserTicketList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  createTicket(
    leagueId: number,
    userId: number,
    state: string,
    date: string,
  ): Observable<UserTicket> {
    return this.http
      .post<UserTicket>(
        `${this.path}/create?league_id=${leagueId}&user_id=${userId}
        &state=${state}&date=${date}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
