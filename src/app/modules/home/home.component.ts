import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app-service.service';
import { IGitHubRepo, ITreeNode, TreeNode } from '../../shared/treeNode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'Dependency Tree';
  inputString = '';

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClickGo(): void {
    console.log('route to tree');
    this.appService.onClickSubmit(this.inputString).subscribe(res => {
      const root = this.buildTree(res);
      // console.log('finish');
      // console.log(root);
      // console.log(res);
      // const data = <ITreeNode> JSON.parse(JSON.stringify(res));
      // const castData = new TreeNode();
      // Object.assign(data, castData);
      // console.log(castData);
      //
      // const child = new TreeNode();
      // child.value = <IGitHubRepo> {name: 'Express', url: 'https://github.com/expressjs/express'};
      // castData.addNode(child);
      // console.log(child);
      // console.log(castData);
      this.router.navigate(['tree']);
    });
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
