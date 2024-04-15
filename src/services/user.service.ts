import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { User } from '../models/user';
import { Serialize } from "dcerialize";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * API path
   */
  path!: string;

  constructor(
    protected http: HttpClient,
  ) {
    this.path = 'http://127.0.0.1:5000/user';
  }

  createUser(user: User): Observable<void> {
    console.log(user)
    return this.http
      .post<void>(`${this.path}/create-user?name=${user.name}&last_names=${user.last_names}
      &email=${user.email}&password=${user.password}&security_word=${user.security_word}`, {})
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }

  getUser(userId: number): Observable<string> {
    return this.http.get<string>(`${this.path}/${userId}`)
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }
}
