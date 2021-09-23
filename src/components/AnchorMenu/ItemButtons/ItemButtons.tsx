import React, { MouseEvent } from 'react';
import { TFunction } from 'react-i18next';

import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';

import './ItemButtons.css';
import { deleteItemAction, duplicateItemAction, newItemAction } from '../../../store/treeStore/treeActions';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { canNodeHaveChildren } from '../../../helpers/treeHelper';

export const generateItemButtons = (
    t: TFunction<'translation'>,
    item: QuestionnaireItem | undefined,
    parentArray: Array<string>,
    showLabel: boolean,
    dispatch: React.Dispatch<ActionType>,
): JSX.Element[] => {
    if (!item) {
        return [];
    }
    const dispatchDeleteItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        dispatch(deleteItemAction(item.linkId, parentArray));
    };

    const dispatchAddChildItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        dispatch(newItemAction(IQuestionnaireItemType.group, [...parentArray, item.linkId]));
    };

    const dispatchDuplicateItem = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        dispatch(duplicateItemAction(item.linkId, parentArray));
    };

    const getClassNames = () => {
        return `item-button ${showLabel ? 'item-button--visible' : ''}`;
    };

    return [
        ...(canNodeHaveChildren(item)
            ? [
                  <button
                      key="new-item-button"
                      className={getClassNames()}
                      onClick={dispatchAddChildItem}
                      aria-label="Add child element"
                      title={t('Follow-up question')}
                  >
                      <i className="add-icon" />
                      {showLabel && <label>{t('Create follow-up question')}</label>}
                  </button>,
              ]
            : []),
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
