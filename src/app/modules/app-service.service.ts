import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/operators';

import { IGitHubRepo, ITreeNode, TreeNode } from '../shared/treeNode';

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
  getTreePage(data: any): void {
    this.root = this.buildTree(data);
    console.log(this.root);
    this.router.navigate(['tree']);
  }

  /** Interface with server **/
  onClickSubmit(gitHubUrl: string): Observable<string> {
    const params = new HttpParams().set('url', gitHubUrl);
    return this.http.get<JSON>(
      'http://localhost:3000/traverse-repo',
      { headers: {}, params: params }
    ).pipe(
        tap((x) => {
          console.log(`Response recieved for ${gitHubUrl}`);
          console.log(x);
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
