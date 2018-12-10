import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { IGitHubRepo, ITreeNode, TreeNode } from '../../shared/tree-node';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() treeNode: ITreeNode<IGitHubRepo>;
  childrenNodes: Array<NodeComponent> = [];
  elementRef: ElementRef;

  constructor() {
    // this.elementRef = elementRef;
  }

  ngOnInit() {
    for (const childTreeNode of this.treeNode.children) {
      const childComponent = new NodeComponent();
      childComponent.treeNode = childTreeNode;
      this.childrenNodes.push(childComponent);
    }
  }

}
