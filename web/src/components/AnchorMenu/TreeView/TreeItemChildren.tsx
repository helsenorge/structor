import type { TreeNode } from "../types";
import type { Items, MarkedItem } from "src/store/treeStore/treeStore";

import { TreeItems } from "./TreeItems";

export interface TreeItemChildrenProps {
  node: TreeNode;
  qItems: Items;
  parentPath: string[];
  depth: number;
  ancestorContinuations: boolean[];
  validationClasses: (linkId: string) => string;
  qCurrentItem: MarkedItem | undefined;
}

export const TreeItemChildren = ({
  node,
  qItems,
  parentPath,
  depth,
  ancestorContinuations,
  validationClasses,
  qCurrentItem,
}: TreeItemChildrenProps): React.JSX.Element | null => {
  if (node.children.length === 0) return null;

  return (
    <>
      {node.children.map((childNode, index) => {
        const childIsLast = index === node.children.length - 1;

        return (
          <TreeItems
            key={childNode.id}
            node={childNode}
            qItems={qItems}
            parentPath={[...parentPath, node.id]}
            isTopItem={false}
            depth={depth + 1}
            isLast={childIsLast}
            ancestorContinuations={[...ancestorContinuations, !childIsLast]}
            validationClasses={validationClasses}
            qCurrentItem={qCurrentItem}
          />
        );
      })}
    </>
  );
};
export default TreeItemChildren;
