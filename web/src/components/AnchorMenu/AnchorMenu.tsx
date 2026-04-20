import { useCallback, useMemo, useState, type Dispatch } from "react";

import { useTranslation } from "react-i18next";

import type {
  ActionType,
  Items,
  MarkedItem,
  OrderItem,
} from "../../store/treeStore/treeStore";
import type { ValidationError } from "../../utils/validationUtils";
import type { Key } from "@react-types/shared";

import {
  DraggedNodeContext,
  type ToolboxDragInfo,
} from "./contexts/DraggedNodeContext";
import { useAnchorMenuHelpers } from "./hooks/useAnchorMenuHelpers";
import { useTreeData } from "./hooks/useTreeData";
import { useTreeDragAndDrop } from "./hooks/useTreeDragAndDrop";
import { Toolbox } from "./Toolbox/Toolbox";
import { TreeView } from "./TreeView/TreeView";
import { updateMarkedLinkIdAction } from "../../store/treeStore/treeActions";

import styles from "./AnchorMenu.module.scss";

interface AnchorMenuProps {
  qOrder: OrderItem[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  validationErrors: ValidationError[];
  dispatch: Dispatch<ActionType>;
}

const getFirstKey = (keys: Set<Key>): string | null => {
  const first = keys.values().next().value;
  if (first === undefined || first === null) {
    return null;
  }
  return String(first);
};

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
  const { t } = useTranslation();

  const RECIPIENT_COMPONENT_LABEL = t("Recipient component");

  const { treeData, parentPathById, expandableKeys } = useTreeData(
    props.qOrder,
    props.qItems,
  );

  const { validationClasses: validationClassesFn } = useAnchorMenuHelpers();

  const validationClasses = useCallback(
    (linkId: string): string =>
      validationClassesFn(linkId, props.validationErrors),
    [validationClassesFn, props.validationErrors],
  );

  const [toolboxDrag, setToolboxDrag] = useState<ToolboxDragInfo | null>(null);

  const handleToolboxDragStart = useCallback(
    (info: ToolboxDragInfo) => setToolboxDrag(info),
    [],
  );
  const handleToolboxDragEnd = useCallback(() => setToolboxDrag(null), []);

  const { dragAndDropHooks, draggedNode } = useTreeDragAndDrop({
    qOrder: props.qOrder,
    qItems: props.qItems,
    treeData,
    parentPathById,
    dispatch: props.dispatch,
    recipientComponentLabel: RECIPIENT_COMPONENT_LABEL,
    toolboxDrag,
  });

  const { dispatch } = props;
  const handleSelectionChange = useCallback(
    (keys: Set<Key>): void => {
      const selectedId = getFirstKey(keys);
      if (!selectedId) {
        return;
      }
      dispatch(
        updateMarkedLinkIdAction(
          selectedId,
          parentPathById.get(selectedId) ?? [],
        ),
      );
    },
    [dispatch, parentPathById],
  );

  const draggedNodeContextValue = useMemo(
    () => ({ draggedNode, toolboxDrag, qItems: props.qItems }),
    [draggedNode, toolboxDrag, props.qItems],
  );

  return (
    <div className={styles.questionnaireOverview}>
      <Toolbox
        recipientComponentLabel={RECIPIENT_COMPONENT_LABEL}
        onToolboxDragStart={handleToolboxDragStart}
        onToolboxDragEnd={handleToolboxDragEnd}
      />

      <DraggedNodeContext.Provider value={draggedNodeContextValue}>
        <TreeView
          qItems={props.qItems}
          qCurrentItem={props.qCurrentItem}
          treeData={treeData}
          parentPathById={parentPathById}
          expandableKeys={expandableKeys}
          dragAndDropHooks={dragAndDropHooks}
          onSelectionChange={handleSelectionChange}
          validationClasses={validationClasses}
          showPlaceholder={props.qOrder.length === 0}
        />
      </DraggedNodeContext.Provider>
    </div>
  );
};

export default AnchorMenu;
