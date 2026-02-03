import type { Dispatch } from "react";

import {
  Tree,
  TreeItem,
  TreeItemContent,
  type DragAndDropHooks,
} from "react-aria-components";

import type {
  ActionType,
  Items,
  MarkedItem,
} from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { Key } from "@react-types/shared";
import type { TFunction } from "i18next";

import { TreeItemContentRenderer } from "../TreeItemContentRenderer/TreeItemContentRenderer";

import styles from "./TreeView.module.scss";

interface TreeViewProps {
  t: TFunction;
  treeData: TreeNode[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  parentPathById: Map<string, string[]>;
  expandedKeys: Set<Key>;
  setExpandedKeys: (keys: Set<Key>) => void;
  dragAndDropHooks: DragAndDropHooks;
  onSelectionChange: (keys: Set<Key>) => void;
  validationClasses: (linkId: string) => string;
  getRelevantIcon: (type?: string) => string;
  dispatch: Dispatch<ActionType>;
  showPlaceholder: boolean;
}

export const TreeView = ({
  t,
  treeData,
  qItems,
  qCurrentItem,
  parentPathById,
  expandedKeys,
  setExpandedKeys,
  dragAndDropHooks,
  onSelectionChange,
  validationClasses,
  getRelevantIcon,
  dispatch,
  showPlaceholder,
}: TreeViewProps): JSX.Element => {
  const renderTreeItems = (
    nodes: TreeNode[],
    ancestorContinuations: boolean[] = [],
  ): JSX.Element[] => {
    return nodes.map((node, index) => {
      const item = qItems[node.id];
      const parentPath = parentPathById.get(node.id) ?? [];
      const isTopItem = parentPath.length === 0;
      const depth = ancestorContinuations.length;
      const isLast = index === nodes.length - 1;
      const childContinuations = [...ancestorContinuations, !isLast];

      return (
        <TreeItem
          key={node.id}
          id={node.id}
          textValue={item?.text || item?.linkId || node.id}
          hasChildItems={node.children.length > 0}
          className={`${styles.item} ${validationClasses(node.id)} ${
            isTopItem ? styles.topItem : ""
          } ${qCurrentItem?.linkId === node.id ? styles.itemSelected : ""}`}
        >
          <TreeItemContent>
            {({ isExpanded }) => (
              <TreeItemContentRenderer
                node={node}
                item={item}
                parentPath={parentPath}
                depth={depth}
                isLast={isLast}
                ancestorContinuations={ancestorContinuations}
                isExpanded={isExpanded}
                getRelevantIcon={getRelevantIcon}
                dispatch={dispatch}
                t={t}
              />
            )}
          </TreeItemContent>

          {node.children.length > 0
            ? renderTreeItems(node.children, childContinuations)
            : null}
        </TreeItem>
      );
    });
  };

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
        {renderTreeItems(treeData)}
      </Tree>

      {showPlaceholder && (
        <p className={styles.placeholder}>
          {t("Drag a component here to start building this Questionnaire")}
        </p>
      )}
    </>
  );
};
