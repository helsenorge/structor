import { memo } from "react";

import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { Items } from "../../../../store/treeStore/treeStore";
import type { TreeNode } from "../../types";

import FormFieldTag from "@helsenorge/designsystem-react/components/FormFieldTag";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import ChevronDown from "@helsenorge/designsystem-react/components/Icons/ChevronDown";
import ChevronRight from "@helsenorge/designsystem-react/components/Icons/ChevronRight";

import { IndentRenderer } from "../../IndentRenderer/IndentRenderer";
import { ItemButtons } from "../../ItemButtons/ItemButtons";
import { TreeItemIcon } from "../TreeItemIcon";

import styles from "./TreeItemContentRenderer.module.scss";

interface TreeItemContentRendererProps {
  node: TreeNode;
  item: Items[string];
  parentPath: string[];
  depth: number;
  isLast: boolean;
  ancestorContinuations: boolean[];
  isExpanded: boolean;
  isDropTarget: boolean | undefined;
}

export const TreeItemContentRenderer = memo(function TreeItemContentRenderer({
  node,
  item,
  parentPath,
  depth,
  isLast,
  ancestorContinuations,
  isExpanded,
  isDropTarget,
}: TreeItemContentRendererProps): JSX.Element {
  const { t } = useTranslation();

  const isTopLevel = depth === 0;

  return (
    <div className={`${styles.row} ${isDropTarget ? styles.dropTarget : ""}`}>
      {depth > 0 && (
        <IndentRenderer
          nodeId={node.id}
          ancestorContinuations={ancestorContinuations}
          isLast={isLast}
        />
      )}

      <div
        className={[
          styles.itemBox,
          isTopLevel ? styles.itemBoxTopLevel : "",
          item?.type === "group" ? styles.itemBoxGroup : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* <DragHandle ariaLabel={t("Drag")} variant="tree" /> */}
        {node.children.length > 0 ? (
          <Button
            slot="chevron"
            className={styles.chevron}
            aria-label={t("Expand/collapse")}
          >
            <Icon size={24} svgIcon={isExpanded ? ChevronDown : ChevronRight} />
          </Button>
        ) : (
          <span className={styles.chevronSpacer} />
        )}
        <TreeItemIcon type={item?.type} />
        <span className={styles.title}>
          {node.hierarchy} {item?.text}
        </span>
        {item?.required && (
          <FormFieldTag
            level="required-field"
            resources={{
              allRequired: t("formAllRequired"),
              requiredField: t("Required"),
              optional: t("formOptional"),
              allOptional: t("formAllOptional"),
              requiredRadiobuttonList: t("formRequiredRadiobuttonList"),
              requiredCheckboxList: t("formRequiredMultiCheckbox"),
              requiredSingleCheckbox: t("formRequiredSingleCheckbox"),
            }}
          />
        )}
        <div
          className={styles.actions}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <ItemButtons item={item} parentArray={parentPath} showLabel={false} />
        </div>
      </div>
    </div>
  );
});
