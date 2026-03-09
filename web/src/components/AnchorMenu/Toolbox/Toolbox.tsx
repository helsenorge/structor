import { useMemo } from "react";

import { GridList, useDragAndDrop } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { ToolboxDragInfo } from "../contexts/DraggedNodeContext";
import type { DragItem, ToolboxNode } from "../types";

import { ToolboxItem } from "./ToolboxItem";
import { TOOLBOX_ITEM_DEFINITIONS } from "./toolboxItems";

import styles from "./Toolbox.module.scss";

interface ToolboxProps {
  recipientComponentLabel: string;
  onToolboxDragStart?: (info: ToolboxDragInfo) => void;
  onToolboxDragEnd?: () => void;
}

const TOOLBOX_DRAG_TYPE = "application/x-hn-questionnaire-item";

export const Toolbox = ({
  recipientComponentLabel,
  onToolboxDragStart,
  onToolboxDragEnd,
}: ToolboxProps): JSX.Element => {
  const { t } = useTranslation();

  const toolboxItems: ToolboxNode[] = useMemo(
    () =>
      TOOLBOX_ITEM_DEFINITIONS.map((def) => ({
        id: def.id,
        type: def.type,
        label: def.isRecipientComponent
          ? recipientComponentLabel
          : t(def.labelKey),
      })),
    [t, recipientComponentLabel],
  );

  const toolboxDnD = useDragAndDrop<ToolboxNode>({
    getItems: (keys): DragItem[] =>
      toolboxItems
        .filter((x) => keys.has(x.id))
        .map((x) => ({
          [TOOLBOX_DRAG_TYPE]: JSON.stringify({ nodeType: x.type }),
        })),
    getAllowedDropOperations: () => ["copy"],
    onDragStart: (e) => {
      const draggedId = e.keys.values().next().value;
      const item = toolboxItems.find((x) => x.id === draggedId);
      if (item && onToolboxDragStart) {
        onToolboxDragStart({ type: item.type, label: item.label });
      }
    },
    onDragEnd: () => {
      onToolboxDragEnd?.();
    },
  });

  return (
    <div className={styles.toolbox}>
      <GridList
        aria-label={t("Components")}
        items={toolboxItems}
        selectionMode="none"
        dragAndDropHooks={toolboxDnD.dragAndDropHooks}
      >
        {(item) => <ToolboxItem item={item} />}
      </GridList>
    </div>
  );
};
