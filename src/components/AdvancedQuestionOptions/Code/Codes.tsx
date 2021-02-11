import React, { useContext, useState } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { Coding } from '../../../types/fhir';
import Btn from '../../Btn/Btn';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { IItemProperty } from '../../../types/IQuestionnareItemType';

import './Codes.css';

type CodeProps = {
    linkId: string;
};

// TODO Support multiple codes?
const Codes = ({ linkId }: CodeProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const getCode = (): Coding | undefined => {
        const codes = state.qItems[linkId].code;
        if (codes) {
            return codes[0];
        }
        return undefined;
    };

    const code = getCode();
    const [codeValue, setCodeValue] = useState(code ? code.code : '');
    const [displayValue, setDisplayValue] = useState(code ? code.display : '');
    const [systemValue, setSystemValue] = useState(code ? code.system : '');

    const dispatchUpdateItemCode = (value: Coding[] | undefined) => {
        dispatch(updateItemAction(linkId, IItemProperty.code, value));
    };

    const createEmptyCode = (): Coding => {
        return { code: '', display: '', system: '' };
    };

    const removeCode = () => {
        dispatchUpdateItemCode(undefined);
        setCodeValue('');
        setDisplayValue('');
        setSystemValue('');
    };

    const updateContext = () => {
        dispatchUpdateItemCode([
            {
                code: codeValue,
                display: displayValue,
                system: systemValue,
            },
        ]);
    };

    // TODO Norwegian labels for Code and Display?
    return (
        <div className="codes">
            <div className="horizontal full">
                <h4>Code</h4>
                {!code && (
                    <Btn
                        title="+ Legg til Code"
                        type="button"
                        onClick={() => {
                            dispatchUpdateItemCode([createEmptyCode()]);
                        }}
                        variant="secondary"
                        size="small"
                    />
                )}
                {code && (
                    <Btn title="- Slett Code" type="button" onClick={removeCode} variant="secondary" size="small" />
                )}
            </div>
            {code && (
                <div className="code-section">
                    <div className="horizontal equal">
                        <div className="form-field">
                            <label>Display</label>
                            <input
                                value={displayValue}
                                onChange={(event) => setDisplayValue(event.target.value)}
                                onBlur={updateContext}
                            />
                        </div>
                        <div className="form-field">
                            <label>Code</label>
                            <input
                                value={codeValue}
                                onChange={(event) => setCodeValue(event.target.value)}
                                onBlur={updateContext}
                            />
                        </div>
                    </div>
                    <div className="horizontal full">
                        <div className="form-field">
                            <label>System</label>
                            <input
                                value={systemValue}
                                onChange={(event) => setSystemValue(event.target.value)}
                                onBlur={updateContext}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Codes;
