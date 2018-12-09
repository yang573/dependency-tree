import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  title = 'Dependency Tree';
  inputString = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getHomePage(): void {
    this.router.navigate(['home']);
  }

  onClickSubmit(GitHubUrl: string): Observable<string> {
    this.router.navigate(['tree']);
    let params = new HttpParams().set('url', GitHubUrl);
    return this.http.get<string>(
      'http://localhost:3000/traverse-repo',
      { headers: {}, params: params }
    ).pipe(
        tap(() => console.log('response recieved asdfa')),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T> () {
    return (error: any): Observable<T> => {
      console.log('whoops');
      console.log(error.message);
      return of({} as T);
    };
  }
}
