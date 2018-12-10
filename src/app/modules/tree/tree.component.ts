import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app-service.service';
import { NodeComponent } from '../../shared/node/node.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  rootNode: NodeComponent;

  constructor(private appService: AppService) {
    const treeRoot = this.appService.getTreeRoot();
    this.rootNode = new NodeComponent();
    this.rootNode.treeNode = treeRoot;
  }

  ngOnInit() {
  }

  onClickBack(): void {
    console.log('route to home');
    this.appService.getHomePage();
  }

}
