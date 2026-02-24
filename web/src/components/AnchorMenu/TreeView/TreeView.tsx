import { Tree, type DragAndDropHooks } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { Items, MarkedItem } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { Key } from "@react-types/shared";

import { TreeItemsList } from "./TreeItemList";

import styles from "./TreeView.module.scss";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeViewProps {
  treeData: TreeNode[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  parentPathById: Map<string, string[]>;
  expandedKeys: Set<Key>;
  setExpandedKeys: (keys: Set<Key>) => void;
  dragAndDropHooks: DragAndDropHooks;
  onSelectionChange: (keys: Set<Key>) => void;
  validationClasses: (linkId: string) => string;
  showPlaceholder: boolean;
}

export const TreeView = ({
  treeData,
  qItems,
  qCurrentItem,
  parentPathById,
  expandedKeys,
  setExpandedKeys,
  dragAndDropHooks,
  onSelectionChange,
  validationClasses,
  showPlaceholder,
}: TreeViewProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <Tree
        aria-label={t("Questionnaire overview")}
        className={`${styles.treeView} ${styles.tree}`}
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={
          qCurrentItem?.linkId
            ? new Set<Key>([qCurrentItem.linkId])
            : new Set<Key>()
        }
        onSelectionChange={(keys) => onSelectionChange(keys as Set<Key>)}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        dragAndDropHooks={dragAndDropHooks}
      >
        <TreeItemsList
          nodes={treeData}
          qItems={qItems}
          qCurrentItem={qCurrentItem}
          parentPathById={parentPathById}
          validationClasses={validationClasses}
        />
      </Tree>

      {showPlaceholder && (
        <p className={styles.placeholder}>
          {t("Drag a component here to start building this Questionnaire")}
        </p>
      )}
    </>
  );
};
