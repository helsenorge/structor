import { useCallback, useMemo } from "react";

import { Tree, type DragAndDropHooks } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { Items, MarkedItem } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { Key } from "@react-types/shared";

import { TreeItemsList } from "./TreeItemList";
import { useExpandedKeys } from "../hooks/useTreeData";

import styles from "./TreeView.module.scss";

export interface TreeViewProps {
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  treeData: TreeNode[];
  parentPathById: Map<string, string[]>;
  expandableKeys: Set<Key>;
  dragAndDropHooks: DragAndDropHooks;
  onSelectionChange: (keys: Set<Key>) => void;
  validationClasses: (linkId: string) => string;
  showPlaceholder: boolean;
}

export const TreeView = ({
  qItems,
  qCurrentItem,
  treeData,
  parentPathById,
  expandableKeys,
  dragAndDropHooks,
  onSelectionChange,
  validationClasses,
  showPlaceholder,
}: TreeViewProps): JSX.Element => {
  const { t } = useTranslation();

  // Default expand all items if expandedKeys is empty
  const [expandedKeys, setExpandedKeys] = useExpandedKeys(expandableKeys);

  const selectedKeys = useMemo(
    () =>
      qCurrentItem?.linkId
        ? new Set<Key>([qCurrentItem.linkId])
        : new Set<Key>(),
    [qCurrentItem?.linkId],
  );

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<Key>) => onSelectionChange(keys as Set<Key>),
    [onSelectionChange],
  );

  return (
    <Tree
      aria-label={t("Questionnaire overview")}
      className={`${styles.treeView} ${styles.tree}`}
      selectionMode="single"
      selectionBehavior="replace"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      expandedKeys={expandedKeys}
      onExpandedChange={setExpandedKeys}
      dragAndDropHooks={dragAndDropHooks}
      renderEmptyState={() =>
        showPlaceholder && treeData.length === 0 ? (
          <div className={styles.emptyDropZone}>
            <span className={styles.emptyDropText}>
              {t("Drag a component here to start building this Questionnaire")}
            </span>
          </div>
        ) : null
      }
    >
      <TreeItemsList
        nodes={treeData}
        qItems={qItems}
        qCurrentItem={qCurrentItem}
        parentPathById={parentPathById}
        validationClasses={validationClasses}
      />
    </Tree>
  );
};
