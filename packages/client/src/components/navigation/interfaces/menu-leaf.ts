
import { IMenuNode } from './menu-node'

export interface IMenuLeaf extends IMenuNode {
  path: string;
  permission?: string;
  hiddenFor?: string[];
  goto?: string;
}
