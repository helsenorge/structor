import React, { MouseEvent } from 'react';
import { TFunction } from 'react-i18next';

import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';

import './ItemButtons.css';
import { deleteItemAction, duplicateItemAction, newItemAction } from '../../../store/treeStore/treeActions';
import { IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import {
    isItemControlHelp,
    isItemControlHighlight,
    isItemControlInline,
    isItemControlSidebar,
} from '../../../helpers/itemControl';

export const generateItemButtons = (
    t: TFunction<'translation'>,
    item: QuestionnaireItem,
    parentArray: Array<string>,
    showLabel: boolean,
    dispatch: React.Dispatch<ActionType>,
): JSX.Element[] => {
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

    const canCreateChild =
        item.type !== IQuestionnaireItemType.display &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlSidebar(item) &&
        !isItemControlHelp(item);

    return [
        ...(canCreateChild
            ? [
                  <button
                      key="new-item-button"
                      className={getClassNames()}
                      onClick={dispatchAddChildItem}
                      aria-label="Add child element"
                      title={t('Oppfølgingsspørsmål')}
                  >
                      <i className="add-icon" />
                      {showLabel && <label>{t('Opprett oppfølgingsspørsmål')}</label>}
                  </button>,
              ]
            : []),
        <button
            key="duplicate-item-button"
            className={getClassNames()}
            onClick={dispatchDuplicateItem}
            aria-label="Duplicate element"
            title={t('Dupliser')}
        >
            <i className="duplicate-icon" />
            {showLabel && <label>{t('Dupliser')}</label>}
        </button>,
        <button
            key="delete-item-button"
            className={getClassNames()}
            onClick={dispatchDeleteItem}
            aria-label="Delete element"
            title={t('Slett')}
        >
            <i className="trash-icon" />
            {showLabel && <label>{t('Slett')}</label>}
        </button>,
    ];
};
