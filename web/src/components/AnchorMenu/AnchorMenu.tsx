import type { Dispatch } from "react";

import { useTranslation } from "react-i18next";

import type {
  ActionType,
  Items,
  MarkedItem,
  OrderItem,
} from "../../store/treeStore/treeStore";
import type { ValidationError } from "../../utils/validationUtils";
import type { Key } from "@react-types/shared";

import { useAnchorMenuHelpers } from "./hooks/useAnchorMenuHelpers";
import { useTreeData, useExpandedKeys } from "./hooks/useTreeData";
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

  // Use custom hooks
  const { treeData, parentPathById, expandableKeys } = useTreeData(
    props.qOrder,
    props.qItems,
  );

  const [expandedKeys, setExpandedKeys] = useExpandedKeys(expandableKeys);

  const { validationClasses, getRelevantIcon } = useAnchorMenuHelpers(
    props.validationErrors,
  );

  const treeDnD = useTreeDragAndDrop({
    qOrder: props.qOrder,
    qItems: props.qItems,
    parentPathById,
    dispatch: props.dispatch,
    recipientComponentLabel: RECIPIENT_COMPONENT_LABEL,
  });

  const handleSelectionChange = (keys: Set<Key>): void => {
    const selectedId = getFirstKey(keys);
    if (!selectedId) {
      return;
    }
    props.dispatch(
      updateMarkedLinkIdAction(
        selectedId,
        parentPathById.get(selectedId) ?? [],
      ),
    );
  };

  return (
    <div className={styles.questionnaireOverview}>
      <Toolbox t={t} recipientComponentLabel={RECIPIENT_COMPONENT_LABEL} />

      <TreeView
        t={t}
        treeData={treeData}
        qItems={props.qItems}
        qCurrentItem={props.qCurrentItem}
        parentPathById={parentPathById}
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
        dragAndDropHooks={treeDnD.dragAndDropHooks}
        onSelectionChange={handleSelectionChange}
        validationClasses={validationClasses}
        getRelevantIcon={getRelevantIcon}
        dispatch={props.dispatch}
        showPlaceholder={props.qOrder.length === 0}
      />
    </div>
  );
};

export default AnchorMenu;
