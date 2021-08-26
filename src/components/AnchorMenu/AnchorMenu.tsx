import './AnchorMenu.css';
import { DndProvider, DragSource } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionType, Items, OrderItem } from '../../store/treeStore/treeStore';
import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import {
    moveItemAction,
    newItemAction,
    reorderItemAction,
    updateMarkedLinkIdAction,
} from '../../store/treeStore/treeActions';
import { ValidationErrors } from '../../helpers/orphanValidation';
import { SortableTreeWithoutDndContext as SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import { isIgnorableItem, isItemControlInline } from '../../helpers/itemControl';
import { generateItemButtons } from './ItemButtons/ItemButtons';

interface AnchorMenuProps {
    qOrder: OrderItem[];
    qItems: Items;
    validationErrors: ValidationErrors[];
    dispatch: React.Dispatch<ActionType>;
}

interface Node {
    title: string;
    hierarchy: string;
    nodeType?: IQuestionnaireItemType;
    children: Node[];
}

interface ExtendedNode {
    node: Node;
    path: string[];
}

interface NodeMoveEvent {
    treeData: Node[];
    nextParentNode: Node;
    node: Node;
    nextPath: string[];
    prevPath: string[];
}

interface NodeVisibilityToggleEvent {
    node: Node;
    expanded: boolean;
}

const externalNodeType = 'yourNodeType';
const externalNodeSpec = {
    // This needs to return an object with a property `node` in it.
    // Object rest spread is recommended to avoid side effects of
    // referencing the same object in different trees.
    beginDrag: (componentProps: any) => ({ node: { ...componentProps.node } }),
};
const externalNodeCollect = (connect: any) => ({
    connectDragSource: connect.dragSource(),
    // Add props via react-dnd APIs to enable more visual
    // customization of your component
    // isDragging: monitor.isDragging(),
    // didDrop: monitor.didDrop(),
});

class externalNodeBaseComponent extends React.Component<any> {
    render() {
        const { connectDragSource, node } = this.props;

        return connectDragSource(
            <div
                style={{
                    padding: '10px',
                    background: 'lightblue',
                    margin: '10px',
                    color: 'black',
                }}
            >
                {node.nodeType}
            </div>,
            { dropEffect: 'copy' },
        );
    }
}

const YourExternalNodeComponent = DragSource(
    externalNodeType,
    externalNodeSpec,
    externalNodeCollect,
)(externalNodeBaseComponent);

const AnchorMenu = (props: AnchorMenuProps): JSX.Element => {
    const { t } = useTranslation();
    const [collapsedNodes, setCollapsedNodes] = React.useState<string[]>([]);

    const mapToTreeData = (item: OrderItem[], hierarchy: string, parentLinkId?: string): Node[] => {
        return item
            .filter((x) => {
                const parentItem = parentLinkId ? props.qItems[parentLinkId] : undefined;
                return !isIgnorableItem(props.qItems[x.linkId], parentItem);
            })
            .map((x, index) => {
                const newHierarchy = `${hierarchy}${index + 1}.`;
                return {
                    title: x.linkId,
                    hierarchy: newHierarchy,
                    children: mapToTreeData(x.items, newHierarchy, x.linkId),
                    expanded: collapsedNodes.indexOf(x.linkId) === -1,
                };
            });
    };

    const getNodeKey = (extendedNode: ExtendedNode): string => {
        return extendedNode.node.title;
    };

    const canCreateChild = (linkId: string): boolean => {
        const item = props.qItems[linkId];
        return item && item.type !== IQuestionnaireItemType.display && !isItemControlInline(item);
    };

    const treePathToOrderArray = (treePath: string[]): string[] => {
        const newPath = [...treePath];
        newPath.splice(-1);
        return newPath;
    };

    const hasValidationError = (linkId: string): boolean => {
        return props.validationErrors.some((error) => error.linkId === linkId);
    };

    const getRelevantIcon = (type?: string) => {
        switch (type) {
            case IQuestionnaireItemType.group:
                return 'folder-icon';
            case IQuestionnaireItemType.display:
                return 'message-icon';
            default:
                return 'question-icon';
        }
    };

    const orderTreeData = mapToTreeData(props.qOrder, '');
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="questionnaire-overview">
                <SortableTree
                    dndType={externalNodeType}
                    treeData={orderTreeData}
                    onChange={() => {
                        /* dummy */
                    }}
                    getNodeKey={getNodeKey}
                    onMoveNode={({ treeData, nextParentNode, node, nextPath, prevPath }: NodeMoveEvent) => {
                        const newPath = treePathToOrderArray(nextPath);
                        // find parent node:
                        const moveIndex = nextParentNode
                            ? nextParentNode.children.findIndex((x: Node) => x.title === node.title)
                            : treeData.findIndex((x: Node) => x.title === node.title);

                        if (node.title === 'NEW' && node.nodeType) {
                            props.dispatch(newItemAction(node.nodeType, newPath, moveIndex));
                        } else {
                            const oldPath = treePathToOrderArray(prevPath);
                            // reorder within same parent
                            if (JSON.stringify(newPath) === JSON.stringify(oldPath)) {
                                props.dispatch(reorderItemAction(node.title, newPath, moveIndex));
                            } else {
                                props.dispatch(moveItemAction(node.title, newPath, oldPath, moveIndex));
                            }
                        }
                    }}
                    onVisibilityToggle={({ node, expanded }: NodeVisibilityToggleEvent) => {
                        const filteredNodes = collapsedNodes.filter((x) => x !== node.title);
                        if (!expanded) {
                            filteredNodes.push(node.title);
                        }
                        setCollapsedNodes(filteredNodes);
                    }}
                    canNodeHaveChildren={(node: Node): boolean => {
                        return canCreateChild(node.title);
                    }}
                    generateNodeProps={(extendedNode: ExtendedNode) => ({
                        className: `anchor-menu__item ${
                            hasValidationError(extendedNode.node.title) ? 'validation-error' : ''
                        }`,
                        title: (
                            <span
                                className="anchor-menu__inneritem"
                                onClick={() => {
                                    props.dispatch(
                                        updateMarkedLinkIdAction(
                                            extendedNode.node.title,
                                            treePathToOrderArray(extendedNode.path),
                                        ),
                                    );
                                }}
                            >
                                <span className={getRelevantIcon(props.qItems[extendedNode.node.title]?.type)} />
                                <span className="anchor-menu__title">
                                    {extendedNode.node.hierarchy}
                                    {` `}
                                    {props.qItems[extendedNode.node.title]?.text}
                                </span>
                            </span>
                        ),
                        buttons: generateItemButtons(
                            t,
                            props.qItems[extendedNode.node.title],
                            treePathToOrderArray(extendedNode.path),
                            false,
                            props.dispatch,
                        ),
                    })}
                />
                {props.qOrder.length === 0 && (
                    <p className="center-text" style={{ padding: '0px 25px' }}>
                        {t('Here you will find a summary of questionnaire elements')}
                    </p>
                )}
                <div className="floating-button">
                    <button
                        className="new-item-button"
                        onClick={() => {
                            props.dispatch(newItemAction(IQuestionnaireItemType.group, []));
                        }}
                    >
                        <i className="add-icon large" aria-label="add element" title={t('Create element')} />
                        {t('Add top-level element')}
                    </button>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: '150px',
                    }}
                >
                    <YourExternalNodeComponent node={{ title: 'NEW', nodeType: IQuestionnaireItemType.group }} />
                    <YourExternalNodeComponent node={{ title: 'NEW', nodeType: IQuestionnaireItemType.string }} />
                    <YourExternalNodeComponent node={{ title: 'NEW', nodeType: IQuestionnaireItemType.text }} />
                </div>
            </div>
        </DndProvider>
    );
};

export default AnchorMenu;
