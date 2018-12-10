import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/operators';

import { IGitHubRepo, ITreeNode, TreeNode } from '../shared/tree-node';
import { IServerResponse } from '../shared/server-response';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  title = 'Dependency Tree';
  root: ITreeNode<IGitHubRepo>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /** Get Data **/
  getTreeRoot() {
    return this.root;
  }

  /** Navigation **/
  getHomePage(): void {
    this.router.navigate(['home']);
  }
  getTreePage(): void {
    this.router.navigate(['tree']);
  }

  /** Interface with server **/
  onClickSubmit(gitHubUrl: string): Observable<string> {
    const params = new HttpParams().set('url', gitHubUrl);
    return this.http.get<JSON>(
      'http://localhost:3000/traverse-repo',
      { headers: {}, params: params }
    ).pipe(
        tap(function(data) {
          const castData = <IServerResponse> (data as any);
          if (castData.status !== 200) {
            console.log('IDK Error');
            console.log(castData.message);
          } else {
            console.log(castData.message);
            this.root = this.buildTree(castData.message);
          }
        }),
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

  private buildTree(data: any): TreeNode<IGitHubRepo> {
    const root = new TreeNode<IGitHubRepo>();
    root.value = <IGitHubRepo> {name: data.value.name, url: data.value.url};
    for (const child of data.children) {
      root.children.push(this.buildTree(child));
    }
    // console.log('recursive');
    // console.log(root);
    // console.log(root.value.name);
    return root;
  }
}
