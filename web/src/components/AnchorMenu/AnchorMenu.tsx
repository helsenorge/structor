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
  if (first === undefined || first === null) return null;
  return String(first);
};

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
  const { t } = useTranslation();

  const RECIPIENT_COMPONENT_LABEL = t("Recipient component");

  const { treeData, parentPathById } = useTreeData(props.qOrder, props.qItems);

  const { validationClasses } = useAnchorMenuHelpers();

  const { dragAndDropHooks } = useTreeDragAndDrop({
    qOrder: props.qOrder,
    qItems: props.qItems,
    treeData,
    parentPathById,
    dispatch: props.dispatch,
    recipientComponentLabel: RECIPIENT_COMPONENT_LABEL,
  });

  const handleSelectionChange = (keys: Set<Key>): void => {
    const selectedId = getFirstKey(keys);
    if (!selectedId) return;
    props.dispatch(
      updateMarkedLinkIdAction(
        selectedId,
        parentPathById.get(selectedId) ?? [],
      ),
    );
  };

  return (
    <div className={styles.questionnaireOverview}>
      <Toolbox recipientComponentLabel={RECIPIENT_COMPONENT_LABEL} />

      <TreeView
        qItems={props.qItems}
        qCurrentItem={props.qCurrentItem}
        qOrder={props.qOrder}
        dragAndDropHooks={dragAndDropHooks}
        onSelectionChange={handleSelectionChange}
        validationClasses={validationClasses}
        showPlaceholder={props.qOrder.length === 0}
      />
    </div>
  );
};

export default AnchorMenu;
