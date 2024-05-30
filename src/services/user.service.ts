import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<User>(`${this.path}/${userId}`).pipe(
      catchError((err) => {
        throw err;
      }),
    );
  }
}
