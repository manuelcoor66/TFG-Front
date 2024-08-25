import { Deserialize, IJsonObject } from 'dcerialize';
import { Observable, catchError, map } from 'rxjs';
import { User, UserByStateRoleList, UserTableList } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStateName } from '../utils/enum';

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

  getUserByid(id: number): Observable<User> {
    return this.http.get<IJsonObject>(`${this.path}/id/${id}`).pipe(
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

  changeSecurityWord(email: string, securityWord: string): Observable<void> {
    return this.http
      .patch<void>(
        `${this.path}/change-security-word?email=${email}&security_word=${securityWord}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  modifyUser(
    email: string,
    name?: string,
    lastNames?: string,
    password?: string,
    securityWord?: string,
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${this.path}/modify-user?name=${name}&last_names=${lastNames}` +
          `&email=${email}&password=${password}&security_word=${securityWord}`,
        {},
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }

  getLeagueEnrolmentsTable(): Observable<UserTableList> {
    return this.http.get<IJsonObject>(`${this.path}/table`).pipe(
      map((users) => Deserialize(users, () => UserTableList)),
      catchError((err) => {
        throw err;
      }),
    );
  }

  getUsersByState(state: UserStateName): Observable<UserByStateRoleList> {
    return this.http
      .get<IJsonObject>(`${this.path}/state-users?state=${state}`)
      .pipe(
        map((users) => Deserialize(users, () => UserByStateRoleList)),
        catchError((err) => {
          throw err;
        }),
      );
  }

  changeUserState(id: number): Observable<void> {
    return this.http.patch<void>(`${this.path}/change-state/${id}`, {}).pipe(
      catchError((err) => {
        throw err;
      }),
    );
  }

  changeUserRole(id: number, role: string): Observable<void> {
    return this.http
      .patch<void>(`${this.path}/change-role?id=${id}&role=${role}`, {})
      .pipe(
        catchError((err) => {
          throw err;
        }),
      );
  }
}
