export interface ITreeNode<T> {
  value: T;
  children: ITreeNode<T>[];

  addNode(node: ITreeNode<T>);
}

export class TreeNode<T> implements ITreeNode<T> {
  value: T;
  children: Array<ITreeNode<T>> = [];

  constructor() {}

  // constructor(data: TreeNode) {
  //   Object.assign(this, data);
  // }

  addNode(node: ITreeNode<T>) {
    if (node instanceof TreeNode) {
      this.children.push(node);
      return true;
    } else {
      console.log(`Error: ${node} is not a TreeNode`);
      return false;
    }
  }
}

export interface IGitHubRepo {
  name: string;
  url: string;
}
