import { type Dispatch, useEffect, useMemo, useState } from "react";

import "./AnchorMenu.css";

import {
  Button,
  DropIndicator,
  GridList,
  GridListItem,
  Tree,
  TreeItem,
  TreeItemContent,
  useDragAndDrop,
} from "react-aria-components";
import { useTranslation } from "react-i18next";

import type {
  ActionType,
  Items,
  MarkedItem,
  OrderItem,
} from "../../store/treeStore/treeStore";
import { IQuestionnaireItemType } from "../../types/IQuestionnareItemType";
import type { ValidationError } from "../../utils/validationUtils";
import type { DropItem, DragItem, Key } from "@react-types/shared";

import FormFieldTag from "@helsenorge/designsystem-react/components/FormFieldTag";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import ChevronDown from "@helsenorge/designsystem-react/components/Icons/ChevronDown";
import ChevronRight from "@helsenorge/designsystem-react/components/Icons/ChevronRight";

import { generateItemButtons } from "./ItemButtons/ItemButtons";
import { isIgnorableItem } from "../../helpers/itemControl";
import {
  canTypeHaveChildren,
  getInitialItemConfig,
} from "../../helpers/questionTypeFeatures";
import {
  moveItemAction,
  newItemAction,
  reorderItemAction,
  updateMarkedLinkIdAction,
} from "../../store/treeStore/treeActions";
import {
  ErrorClassVariant,
  getSeverityClass,
} from "../Validation/validationHelper";

interface AnchorMenuProps {
  qOrder: OrderItem[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  validationErrors: ValidationError[];
  dispatch: Dispatch<ActionType>;
}

type TreeNode = {
  id: string;
  hierarchy: string;
  children: TreeNode[];
};

type ToolboxNode = {
  id: string;
  type: IQuestionnaireItemType;
  label: string;
};

const TOOLBOX_DRAG_TYPE = "application/x-hn-questionnaire-item";
const TREE_ITEM_DRAG_TYPE = "application/x-hn-tree-item";
const TREE_INDENT_UNIT_PX = 24;

const getFirstKey = (keys: Set<Key>): string | null => {
  const first = keys.values().next().value;
  if (first === undefined || first === null) {
    return null;
  }
  return String(first);
};

const getDroppedToolboxType = async (
  items: DropItem[],
): Promise<IQuestionnaireItemType | null> => {
  for (const item of items) {
    if (item.kind !== "text") {
      continue;
    }
    if (!item.types.has(TOOLBOX_DRAG_TYPE)) {
      continue;
    }
    try {
      const data = await item.getText(TOOLBOX_DRAG_TYPE);
      const parsed = JSON.parse(data) as { nodeType?: IQuestionnaireItemType };
      return parsed.nodeType ?? null;
    } catch {
      return null;
    }
  }
  return null;
};

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

type IndentRendererProps = {
  nodeId: string;
  ancestorContinuations: boolean[];
  isLast: boolean;
};

const IndentRenderer = ({
  nodeId,
  ancestorContinuations,
  isLast,
}: IndentRendererProps): JSX.Element => {
  return (
    <span className="anchor-menu__indent" aria-hidden="true">
      {ancestorContinuations.map((cont, idx) => (
        <span
          key={`${nodeId}-indent-${idx}`}
          className="anchor-menu__indent-col"
          data-continuation={cont ? "1" : "0"}
        />
      ))}
      <span
        className="anchor-menu__indent-col anchor-menu__indent-col--self"
        data-last={isLast ? "1" : "0"}
      />
    </span>
  );
};

type TreeItemContentRendererProps = {
  node: TreeNode;
  item: Items[string];
  parentPath: string[];
  depth: number;
  isLast: boolean;
  ancestorContinuations: boolean[];
  isExpanded: boolean;
  validationClasses: (linkId: string) => string;
  getRelevantIcon: (type?: string) => string;
  dispatch: Dispatch<ActionType>;
  t: ReturnType<typeof useTranslation>["t"];
};

const TreeItemContentRenderer = ({
  node,
  item,
  parentPath,
  depth,
  isLast,
  ancestorContinuations,
  isExpanded,
  getRelevantIcon,
  dispatch,
  t,
}: TreeItemContentRendererProps): JSX.Element => {
  return (
    <div className="anchor-menu__row">
      {depth > 0 && (
        <IndentRenderer
          nodeId={node.id}
          ancestorContinuations={ancestorContinuations}
          isLast={isLast}
        />
      )}

      <Button
        slot="drag"
        className="drag-handle anchor-menu__draghandle"
        aria-label={t("Drag")}
      >
        <span className="drag-handle__dots" aria-hidden="true" />
      </Button>

      {node.children.length > 0 ? (
        <Button
          slot="chevron"
          className="anchor-menu__chevron"
          aria-label={t("Expand/collapse")}
        >
          <Icon size={18} svgIcon={isExpanded ? ChevronDown : ChevronRight} />
        </Button>
      ) : (
        <span className="anchor-menu__chevron-spacer" />
      )}

      <span className={getRelevantIcon(item?.type)} />

      <span className="anchor-menu__title">
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
        className="anchor-menu__actions"
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        {generateItemButtons(t, item, parentPath, false, dispatch)}
      </div>
    </div>
  );
};

type DropIndicatorRendererProps = {
  target: Parameters<
    NonNullable<Parameters<typeof useDragAndDrop>[0]["renderDropIndicator"]>
  >[0];
  parentPathById: Map<string, string[]>;
};

const DropIndicatorRenderer = ({
  target,
  parentPathById,
}: DropIndicatorRendererProps): JSX.Element => {
  const isItemTarget = target.type === "item";
  const dropPosition = isItemTarget ? target.dropPosition : "after";
  const key = isItemTarget ? String(target.key) : null;

  const parentPath = key ? (parentPathById.get(key) ?? []) : [];
  const depth =
    dropPosition === "on" ? parentPath.length + 1 : parentPath.length;
  const dropIndentPx = depth * TREE_INDENT_UNIT_PX;

  return (
    <DropIndicator
      target={target}
      className={`anchor-menu__drop-indicator anchor-menu__drop-indicator--${dropPosition}`}
      style={
        {
          "--drop-indent": `${dropIndentPx}px`,
          "--tree-item-level": depth,
        } as React.CSSProperties
      }
      data-depth={depth}
    />
  );
};

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
  const { t } = useTranslation();
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());

  const RECIPIENT_COMPONENT_LABEL = t("Recipient component");

  const validationClasses = (linkId: string): string => {
    return getSeverityClass(
      ErrorClassVariant.highlight,
      props.validationErrors.filter((error) => error.linkId === linkId),
    );
  };

  const getRelevantIcon = (type?: string): string => {
    switch (type) {
      case IQuestionnaireItemType.group:
        return "folder-icon";
      case IQuestionnaireItemType.display:
        return "message-icon";
      default:
        return "question-icon";
    }
  };

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
        RECIPIENT_COMPONENT_LABEL,
      ),
      createTypeComponent(IQuestionnaireItemType.boolean, t("Confirmation")),
      createTypeComponent(IQuestionnaireItemType.choice, t("Choice")),
      createTypeComponent(IQuestionnaireItemType.date, t("Date")),
      createTypeComponent(IQuestionnaireItemType.time, t("Time")),
      createTypeComponent(IQuestionnaireItemType.integer, t("Number")),
      createTypeComponent(IQuestionnaireItemType.quantity, t("Quantity")),
    ];
  }, [t]);

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

  const { treeData, parentPathById, expandableKeys } = useMemo(() => {
    const parentPathMap = new Map<string, string[]>();
    const expandable = new Set<Key>();

    const mapToTreeData = (
      items: OrderItem[],
      hierarchy: string,
      parentPath: string[],
      parentLinkId?: string,
    ): TreeNode[] => {
      const parentItem = parentLinkId ? props.qItems[parentLinkId] : undefined;
      return items
        .filter((x) => !isIgnorableItem(props.qItems[x.linkId], parentItem))
        .map((x, index) => {
          const newHierarchy = `${hierarchy}${index + 1}.`;
          parentPathMap.set(x.linkId, parentPath);
          const children = mapToTreeData(
            x.items,
            newHierarchy,
            [...parentPath, x.linkId],
            x.linkId,
          );
          if (children.length > 0) {
            expandable.add(x.linkId);
          }
          return {
            id: x.linkId,
            hierarchy: newHierarchy,
            children,
          };
        });
    };

    return {
      treeData: mapToTreeData(props.qOrder, "", []),
      parentPathById: parentPathMap,
      expandableKeys: expandable,
    };
  }, [props.qItems, props.qOrder]);

  useEffect(() => {
    if (expandedKeys.size === 0 && expandableKeys.size > 0) {
      setExpandedKeys(new Set(expandableKeys));
    }
  }, [expandableKeys, expandedKeys.size]);

  const getOrderArray = (orderPath: string[]): OrderItem[] => {
    let current = props.qOrder;
    for (const id of orderPath) {
      const found = current.find((x) => x.linkId === id);
      if (!found) {
        return [];
      }
      current = found.items;
    }
    return current;
  };

  const getUiSiblingIds = (parentPath: string[]): string[] => {
    const parentId = parentPath[parentPath.length - 1];
    const parentItem = parentId ? props.qItems[parentId] : undefined;
    return getOrderArray(parentPath)
      .filter((x) => !isIgnorableItem(props.qItems[x.linkId], parentItem))
      .map((x) => x.linkId);
  };

  const treeDnD = useDragAndDrop({
    acceptedDragTypes: "all",
    getItems: (keys: Set<Key>): DragItem[] => {
      return Array.from(keys).map((k) => ({
        [TREE_ITEM_DRAG_TYPE]: String(k),
      }));
    },
    getDropOperation: (_target, types, allowedOperations) => {
      if (types.has(TOOLBOX_DRAG_TYPE)) {
        return allowedOperations.includes("copy") ? "copy" : "move";
      }
      return "move";
    },
    shouldAcceptItemDrop: (target) => {
      if (target.dropPosition !== "on") {
        return true;
      }
      const item = props.qItems[String(target.key)];
      return item ? canTypeHaveChildren(item) : false;
    },
    onMove: (e): void => {
      const draggedId = getFirstKey(e.keys);
      if (!draggedId) {
        return;
      }

      const targetId = String(e.target.key);
      const oldParentPath = parentPathById.get(draggedId) ?? [];
      const targetParentPath = parentPathById.get(targetId) ?? [];

      let newParentPath = targetParentPath;
      let newIndex: number | undefined;

      if (e.target.dropPosition === "on") {
        newParentPath = [...targetParentPath, targetId];
      } else {
        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }
        newIndex = targetIndex + (e.target.dropPosition === "after" ? 1 : 0);

        if (arraysEqual(oldParentPath, targetParentPath)) {
          const oldSiblings = targetSiblings;
          const oldIndex = oldSiblings.indexOf(draggedId);
          if (oldIndex !== -1 && oldIndex < newIndex) {
            newIndex -= 1;
          }
        }
      }

      if (arraysEqual(oldParentPath, newParentPath)) {
        if (newIndex === undefined) {
          return;
        }
        props.dispatch(reorderItemAction(draggedId, newParentPath, newIndex));
      } else {
        props.dispatch(
          moveItemAction(draggedId, newParentPath, oldParentPath, newIndex),
        );
      }
    },
    onInsert: (e): void => {
      const insertAsync = async (): Promise<void> => {
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }

        const targetId = String(e.target.key);
        const targetParentPath = parentPathById.get(targetId) ?? [];

        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }

        const insertIndex =
          targetIndex + (e.target.dropPosition === "after" ? 1 : 0);
        const newItem = getInitialItemConfig(
          nodeType,
          RECIPIENT_COMPONENT_LABEL,
        );
        props.dispatch(newItemAction(newItem, targetParentPath, insertIndex));
      };

      void insertAsync();
    },
    onItemDrop: (e): void => {
      const itemDropAsync = async (): Promise<void> => {
        if (e.isInternal) {
          return;
        }
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }
        const targetId = String(e.target.key);
        const targetParentPath = parentPathById.get(targetId) ?? [];
        const newParentPath = [...targetParentPath, targetId];
        const newItem = getInitialItemConfig(
          nodeType,
          RECIPIENT_COMPONENT_LABEL,
        );
        props.dispatch(newItemAction(newItem, newParentPath));
      };

      void itemDropAsync();
    },
    onRootDrop: (e): void => {
      const rootDropAsync = async (): Promise<void> => {
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }
        const newItem = getInitialItemConfig(
          nodeType,
          RECIPIENT_COMPONENT_LABEL,
        );
        props.dispatch(newItemAction(newItem, []));
      };

      void rootDropAsync();
    },
    renderDropIndicator: (target): JSX.Element => {
      return (
        <DropIndicatorRenderer
          target={target}
          parentPathById={parentPathById}
        />
      );
    },
  });

  const renderTreeItems = (
    nodes: TreeNode[],
    ancestorContinuations: boolean[] = [],
  ): JSX.Element[] => {
    return nodes.map((node, index) => {
      const item = props.qItems[node.id];
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
          className={`anchor-menu__item ${validationClasses(node.id)} ${
            isTopItem ? "anchor-menu__topitem" : ""
          } ${
            props.qCurrentItem?.linkId === node.id
              ? "anchor-menu__item--selected"
              : ""
          }`}
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
                validationClasses={validationClasses}
                getRelevantIcon={getRelevantIcon}
                dispatch={props.dispatch}
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
    <div className="questionnaire-overview">
      <div className="questionnaire-overview__toolbox">
        <strong>{t("Components")}</strong>
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
              className="anchor-menu__dragcomponent"
            >
              <Button
                slot="drag"
                className="drag-handle anchor-menu__toolbox-draghandle"
                aria-label={t("Drag")}
              >
                <span className="drag-handle__dots" aria-hidden="true" />
              </Button>
              <span className="anchor-menu__toolbox-label">{item.label}</span>
            </GridListItem>
          )}
        </GridList>
      </div>

      <Tree
        aria-label={t("Questionnaire overview")}
        className="questionnaire-overview__treeview anchor-menu__tree"
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={
          props.qCurrentItem?.linkId
            ? new Set<Key>([props.qCurrentItem.linkId])
            : new Set<Key>()
        }
        onSelectionChange={(keys) => {
          const selectedId = getFirstKey(keys as Set<Key>);
          if (!selectedId) {
            return;
          }
          props.dispatch(
            updateMarkedLinkIdAction(
              selectedId,
              parentPathById.get(selectedId) ?? [],
            ),
          );
        }}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        dragAndDropHooks={treeDnD.dragAndDropHooks}
      >
        {renderTreeItems(treeData)}
      </Tree>

      {props.qOrder.length === 0 && (
        <p className="anchor-menu__placeholder">
          {t("Drag a component here to start building this Questionnaire")}
        </p>
      )}
    </div>
  );
};

export default AnchorMenu;
