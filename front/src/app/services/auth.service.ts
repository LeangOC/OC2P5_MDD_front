import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  register(
    user: User
  ): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/register`,
      user,
      {
        responseType: 'text'
      }
    );
  }

  login(
    email: string,
    password: string
  ): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/login`,
      {
        email,
        password
      },
      {
        responseType: 'text'
      }
    );
  }
}
