import { Observable, catchError, map } from 'rxjs';
import { Deserialize } from 'dcerialize';
import { HttpClient } from '@angular/common/http';
import { IJsonObject } from 'dcerialize';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * API path
   */
  path!: string;

  constructor(protected http: HttpClient) {
    this.path = 'http://127.0.0.1:5000/user';
  }

  createUser(user: User): Observable<void> {
    return this.http
      .post<void>(
        `${this.path}/create-user?name=${user.name}&last_names=${user.lastNames}
      &email=${user.email}&password=${user.password}&security_word=${user.securityWord}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<IJsonObject>(`${this.path}/${userId}`).pipe(
      map((user) => Deserialize(user, () => User)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<IJsonObject>(`${this.path}/email/${email}`).pipe(
      map((user) => Deserialize(user, () => User)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  changePassword(email: string, password: string): Observable<void> {
    return this.http
      .patch<void>(
        `${this.path}/change-password?email=${email}&new_password=${password}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
