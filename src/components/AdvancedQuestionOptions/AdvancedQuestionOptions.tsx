import React, { FocusEvent, useContext, useState } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../types/fhir';
import { updateItemAction, updateLinkIdAction } from '../../store/treeStore/treeActions';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Initial from './Initial/Initial';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
};

const AdvancedQuestionOptions = ({ item, parentArray }: AdvancedQuestionOptionsProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [linkId, setLinkId] = useState(item.linkId);
    const { qItems } = state;

    const isRepeatsAndReadOnlyApplicable = item.type !== IQuestionnaireItemType.display;

    const isInitialApplicable =
        item.type !== IQuestionnaireItemType.display && item.type !== IQuestionnaireItemType.group;

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(item.linkId, name, value));
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
        </>
    );
};

export default AdvancedQuestionOptions;
