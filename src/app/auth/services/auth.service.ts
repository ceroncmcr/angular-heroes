import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser() : User | undefined {
    if( !this.user) return undefined;

    return structuredClone(this.user);
  }

  login( email: string, password: string) : Observable<User> {
    // http.post( url, body , {headers} )

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', 'fsdfdsfdsfgsdfsdf.fdfsdfsdfdsffd.dfsghgdfhbfgjtfg')),
        // catchError(() => of(undefined))
      );
  }

  checkAuthentication(): Observable<boolean> {
    if( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user),
        catchError( () => of(false)),
      );

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
