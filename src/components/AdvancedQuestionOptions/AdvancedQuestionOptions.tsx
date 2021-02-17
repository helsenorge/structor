import React, { FocusEvent, useContext, useState } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../types/fhir';
import {
    newItemHelpIconAction,
    updateItemAction,
    updateLinkIdAction,
    deleteItemAction,
} from '../../store/treeStore/treeActions';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Initial from './Initial/Initial';
import FormField from '../FormField/FormField';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
};

const AdvancedQuestionOptions = ({ item, parentArray }: AdvancedQuestionOptionsProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [linkId, setLinkId] = useState(item.linkId);
    const { qItems, qOrder } = state;

    const isRepeatsAndReadOnlyApplicable = item.type !== IQuestionnaireItemType.display;

    const isInitialApplicable =
        item.type !== IQuestionnaireItemType.display && item.type !== IQuestionnaireItemType.group;

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const dispatchUpdateItemX = (linkId: string, value: string) => {
        dispatch(updateItemAction(linkId, IItemProperty.text, value));
    };

    const dispatchInlineHelp = () => {
        const inlineHelp = itemInlineHelperItem();
        if (inlineHelp.exist && inlineHelp.linkId) {
            dispatch(deleteItemAction(inlineHelp.linkId, [...parentArray, item.linkId]));
        } else {
            dispatch(newItemHelpIconAction([...parentArray, item.linkId]));
        }
    };

    function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>) {
        // Verify no duplicates
        if (isDuplicateLinkId || event.target.value === item.linkId) {
            return;
        }
        dispatch(updateLinkIdAction(item.linkId, event.target.value, parentArray));
    }

    function validateLinkId(linkId: string) {
        if (qItems[linkId] === undefined || linkId === item.linkId) {
            setDuplicateLinkId(false);
        } else {
            setDuplicateLinkId(true);
        }
    }

    function resetLinkId() {
        setLinkId(item.linkId);
        validateLinkId(item.linkId);
    }

    function search(value: string, reverse = false) {
        const parrentLinkID = parentArray.length > 0 ? parentArray[0] : item.linkId;
        const hierarchyToSearch = qOrder.findIndex((x) => x.linkId === parrentLinkID);
        const stack = [qOrder[hierarchyToSearch]];
        while (stack.length) {
            const node = stack[reverse ? 'pop' : 'shift']();
            if (node && node['linkId'] === value) return node;
            node && node.items && stack.push(...node.items);
        }
        return null;
    }

    const handleInlineHelpText = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        const children = search(item.linkId)?.items;
        children?.forEach((x) => {
            if (qItems[x.linkId].extension?.find((y) => y.url === IExtentionType.itemControl)) {
                dispatchUpdateItemX(qItems[x.linkId].linkId, event.target.value);
            }
        });
    };

    const itemInlineHelperItem = () => {
        const children = search(item.linkId)?.items;
        let text;
        let exist = false;
        let linkId = '';
        children?.forEach((x) => {
            if (qItems[x.linkId].extension?.find((y) => y.url === IExtentionType.itemControl)) {
                text = qItems[x.linkId].text;
                exist = true;
                linkId = x.linkId;
            }
        });

        return { text, exist, linkId };
    };

    return (
        <>
            {isRepeatsAndReadOnlyApplicable && (
                <div className="horizontal equal">
                    <div className="form-field">
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.repeats, !item.repeats)}
                            value={item.repeats || false}
                            label="Kan gjentas"
                            initial
                        />
                    </div>
                    <div className="form-field">
                        <SwitchBtn
                            onChange={() => dispatchUpdateItem(IItemProperty.readOnly, !item.readOnly)}
                            value={item.readOnly || false}
                            label="Skrivebeskyttet"
                            initial
                        />
                    </div>
                </div>
            )}
            {isInitialApplicable && (
                <div className="horizontal full">
                    <Initial item={item} />
                </div>
            )}
            <div className="horizontal full">
                <div className={`form-field ${isDuplicateLinkId ? 'field-error' : ''}`}>
                    <label>LinkId</label>
                    <input
                        value={linkId}
                        onChange={(event) => {
                            const {
                                target: { value: newLinkId },
                            } = event;
                            validateLinkId(newLinkId);
                            setLinkId(event.target.value);
                        }}
                        onBlur={dispatchUpdateLinkId}
                    />
                    {isDuplicateLinkId && (
                        <div className="msg-error">
                            LinkId er allerede i bruk{' '}
                            <button onClick={resetLinkId}>
                                <img src={UndoIcon} height={16} /> Sett tilbake til opprinnelig verdi
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <FormField>
                    <SwitchBtn
                        onChange={() => dispatchInlineHelp()}
                        value={itemInlineHelperItem().exist}
                        label="Skru på hjelpeikon"
                        initial
                    />
                </FormField>
                {itemInlineHelperItem().exist && (
                    <FormField label="Skriv en hjelpende tekst">
                        <textarea rows={2} onBlur={handleInlineHelpText} defaultValue={itemInlineHelperItem().text} />
                    </FormField>
                )}
            </div>
        </>
    );
};

export default AdvancedQuestionOptions;
