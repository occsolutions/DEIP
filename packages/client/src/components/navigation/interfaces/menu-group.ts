
import { IMenuLeaf } from './menu-leaf'
import { IMenuNode } from './menu-node'

export interface IMenuGroup extends IMenuNode {
  open?: boolean;
  child: Array<IMenuLeaf | IMenuGroup>;
}
