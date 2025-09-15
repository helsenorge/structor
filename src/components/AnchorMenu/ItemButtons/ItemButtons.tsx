import React, { MouseEvent } from 'react';
import { TFunction } from 'react-i18next';

import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';

import './ItemButtons.css';
import { deleteItemAction, duplicateItemAction, updateMarkedLinkIdAction } from '../../../store/treeStore/treeActions';
import { Node } from '../../../store/treeStore/treeActions';

export const generateItemButtons = (
    t: TFunction<'translation'>,
    item: QuestionnaireItem | undefined,
    parentArray: Array<string>,
    showLabel: boolean,
    dispatch: React.Dispatch<ActionType>,
    selectedNodes?: { node: Node; path: Array<string> }[],
    setSelectedNodes?: React.Dispatch<React.SetStateAction<{ node: Node; path: Array<string> }[]>>,
): JSX.Element[] => {
    if (!item) {
        return [];
    }

    const dispatchDeleteItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        const updatedSelectedNodes = selectedNodes?.filter((node) => node.node.title != item.linkId) || [];
        dispatch(deleteItemAction(item.linkId, parentArray));
        if (setSelectedNodes) {
            setSelectedNodes(updatedSelectedNodes);
        }
    };

    const dispatchDuplicateItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        dispatch(duplicateItemAction(item.linkId, parentArray));
    };

    const dispatchSettingsItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        dispatch(updateMarkedLinkIdAction(item.linkId, parentArray));
    };

    const getClassNames = () => {
        return `item-button ${showLabel ? 'item-button--visible' : ''}`;
    };

    return [
        <button
            key="settings-item-button"
            className={getClassNames()}
            onClick={dispatchSettingsItem}
            aria-label="Settings element"
            title={t('Settings')}
        >
            <i className="settings-icon" />
            {showLabel && <label>{t('Settings')}</label>}
        </button>,
        <button
            key="duplicate-item-button"
            className={getClassNames()}
            onClick={dispatchDuplicateItem}
            aria-label="Duplicate element"
            title={t('Duplicate')}
        >
            <i className="duplicate-icon" />
            {showLabel && <label>{t('Duplicate')}</label>}
        </button>,
        <button
            key="delete-item-button"
            className={getClassNames()}
            onClick={dispatchDeleteItem}
            aria-label="Delete element"
            title={t('Delete')}
        >
            <i className="trash-icon" />
            {showLabel && <label>{t('Delete')}</label>}
        </button>,
    ];
};
