import { useMemo } from "react";

import { GridList, GridListItem, useDragAndDrop } from "react-aria-components";
import { useTranslation } from "react-i18next";

import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { DragItem, ToolboxNode } from "../types";

import { DragHandle } from "../DragHandle/DragHandle";

import styles from "./Toolbox.module.scss";

interface ToolboxProps {
  recipientComponentLabel: string;
}

const TOOLBOX_DRAG_TYPE = "application/x-hn-questionnaire-item";

export const Toolbox = ({
  recipientComponentLabel,
}: ToolboxProps): JSX.Element => {
  const { t } = useTranslation();

  const createTypeComponent = (
    type: IQuestionnaireItemType,
    label: string,
  ): ToolboxNode => {
    return {
      id: `${type}`,
      type,
      label,
    };
  };

  const toolboxItems: ToolboxNode[] = useMemo(() => {
    return [
      createTypeComponent(IQuestionnaireItemType.group, t("Group")),
      createTypeComponent(IQuestionnaireItemType.string, t("Text answer")),
      createTypeComponent(
        IQuestionnaireItemType.display,
        t("Information text"),
      ),
      createTypeComponent(IQuestionnaireItemType.attachment, t("Attachment")),
      createTypeComponent(IQuestionnaireItemType.receiver, t("Recipient list")),
      createTypeComponent(
        IQuestionnaireItemType.receiverComponent,
        recipientComponentLabel,
      ),
      createTypeComponent(IQuestionnaireItemType.boolean, t("Confirmation")),
      createTypeComponent(IQuestionnaireItemType.choice, t("Choice")),
      createTypeComponent(IQuestionnaireItemType.date, t("Date")),
      createTypeComponent(IQuestionnaireItemType.time, t("Time")),
      createTypeComponent(IQuestionnaireItemType.integer, t("Number")),
      createTypeComponent(IQuestionnaireItemType.quantity, t("Quantity")),
    ];
  }, [t, recipientComponentLabel]);

  const toolboxDnD = useDragAndDrop<ToolboxNode>({
    getItems: (keys, items): DragItem[] => {
      return items
        .filter((x) => keys.has(x.id))
        .map((x) => ({
          [TOOLBOX_DRAG_TYPE]: JSON.stringify({ nodeType: x.type }),
        }));
    },
    getAllowedDropOperations: () => ["copy"],
  });

  return (
    <div className={styles.toolbox}>
      <GridList
        aria-label={t("Components")}
        items={toolboxItems}
        selectionMode="none"
        dragAndDropHooks={toolboxDnD.dragAndDropHooks}
      >
        {(item) => (
          <GridListItem
            id={item.id}
            textValue={item.label}
            className={styles.dragComponent}
          >
            <DragHandle ariaLabel={t("Drag")} variant="toolbox" />
            <span className={styles.label}>{item.label}</span>
          </GridListItem>
        )}
      </GridList>
    </div>
  );
};
