import type { ToolboxDragInfo } from "../contexts/DraggedNodeContext";
import type { TreeNode } from "../types";
import type { Items } from "src/store/treeStore/treeStore";

import { GhostNode, ToolboxGhostNode } from "./DropIndicatorRenderer";

import styles from "./DropIndicatorRenderer.module.scss";

interface DropContentProps {
  draggedNode?: TreeNode | null;
  toolboxDrag?: ToolboxDragInfo | null;
  qItems?: Items;
  dropPosition: string;
  depth: number;
}

export const DropContent = ({
  draggedNode,
  toolboxDrag,
  qItems,
  dropPosition,
  depth,
}: DropContentProps): JSX.Element | null => {
  if (draggedNode && qItems && dropPosition !== "on") {
    return (
      <div className={styles.ghostPreview}>
        <GhostNode
          node={draggedNode}
          qItems={qItems}
          depth={0}
          isLast={true}
          ancestorContinuations={[]}
        />
      </div>
    );
  }
  if (toolboxDrag && dropPosition !== "on") {
    return (
      <div className={styles.ghostPreview}>
        <ToolboxGhostNode toolboxDrag={toolboxDrag} />
      </div>
    );
  }
  if (dropPosition !== "on") {
    return (
      <div className={styles.previewRow}>
        <div className={styles.previewDragHandle} aria-hidden="true">
          <span className={styles.previewDots} />
        </div>
        <span className={styles.previewPlaceholder}>
          {`Nytt element her (nivå ${depth})`}
        </span>
      </div>
    );
  }
  return null;
};

export default DropContent;
