import { Tree, type DragAndDropHooks } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type {
  Items,
  MarkedItem,
  OrderItem,
} from "../../../store/treeStore/treeStore";
import type { Key } from "@react-types/shared";

import { TreeItemsList } from "./TreeItemList";
import { useExpandedKeys, useTreeData } from "../hooks/useTreeData";

import styles from "./TreeView.module.scss";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeViewProps {
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  dragAndDropHooks: DragAndDropHooks;
  onSelectionChange: (keys: Set<Key>) => void;
  validationClasses: (linkId: string) => string;
  showPlaceholder: boolean;
  qOrder: OrderItem[];
}

export const TreeView = ({
  qItems,
  qCurrentItem,
  qOrder,
  dragAndDropHooks,
  onSelectionChange,
  validationClasses,
  showPlaceholder,
}: TreeViewProps): JSX.Element => {
  const { t } = useTranslation();
  const { treeData, parentPathById, expandableKeys } = useTreeData(
    qOrder,
    qItems,
  );

  // Default expand all items if expandedKeys is empty
  const [expandedKeys, setExpandedKeys] = useExpandedKeys(expandableKeys);

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
