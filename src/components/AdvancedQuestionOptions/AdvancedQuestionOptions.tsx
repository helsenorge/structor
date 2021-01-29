import React, { useContext, useState, FocusEvent } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../types/fhir';
import { updateLinkIdAction } from '../../store/treeStore/treeActions';
import UndoIcon from '../../images/icons/arrow-undo-outline.svg';
import './AdvancedQuestionOptions.css';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
};

const AdvancedQuestionOptions = ({ item, parentArray }: AdvancedQuestionOptionsProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
    const [linkId, setLinkId] = useState(item.linkId);
    const { qItems } = state;

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
        </>
    );
};

export default AdvancedQuestionOptions;
