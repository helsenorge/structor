import React, { useContext } from 'react';
import {
    addItemCodeAction,
    deleteItemCodeAction,
    updateItemCodePropertyAction,
} from '../../../store/treeStore/treeActions';
import Btn from '../../Btn/Btn';
import { Coding } from '../../../types/fhir';
import createUUID from '../../../helpers/CreateUUID';
import { ICodingProperty } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import SystemField from '../../FormField/SystemField';
import { createSystemUUID } from '../../../helpers/systemHelper';
import './Codes.css';

type CodeProps = {
    linkId: string;
};

const Codes = ({ linkId }: CodeProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const codes = state.qItems[linkId].code?.map((code) => {
        // Add id (for internal usage) if not already set
        return { ...code, id: code.id || createUUID() };
    });

    const createEmptyCode = (): Coding => {
        return { code: '', display: '', system: createSystemUUID(), id: createUUID() };
    };

    const updateCode = (index: number, prop: ICodingProperty, value: string) => {
        dispatch(updateItemCodePropertyAction(linkId, index, prop, value));
    };

    const renderCode = (code: Coding, index: number) => {
        return (
            <div key={`${code.id}`} className="code-section">
                <div className="horizontal equal">
                    <div className="form-field">
                        <label>Display</label>
                        <input
                            defaultValue={code.display}
                            onBlur={(event) => updateCode(index, ICodingProperty.display, event.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Code</label>
                        <input
                            defaultValue={code.code}
                            onBlur={(event) => updateCode(index, ICodingProperty.code, event.target.value)}
                        />
                    </div>
                </div>
                <div className="horizontal full">
                    <SystemField
                        value={code.system}
                        onBlur={(event) => updateCode(index, ICodingProperty.system, event.target.value)}
                    />
                </div>
                <div className="center-text">
                    <Btn
                        title="- Fjern Code"
                        type="button"
                        onClick={() => dispatch(deleteItemCodeAction(linkId, index))}
                        variant="secondary"
                        size="small"
                    />
                </div>
                <hr style={{ margin: '24px 0px' }} />
            </div>
        );
    };

    return (
        <div className="codes">
            {codes && codes.map((code, index) => renderCode(code, index))}
            <div className="center-text">
                <Btn
                    title="+ Legg til Code"
                    type="button"
                    onClick={() => {
                        dispatch(addItemCodeAction(linkId, createEmptyCode()));
                    }}
                    variant="primary"
                    size="small"
                />
            </div>
        </div>
    );
};

export default Codes;
