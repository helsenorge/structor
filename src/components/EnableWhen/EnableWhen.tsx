import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../types/fhir';
import { IEnableWhen, IItemProperty } from '../../types/IQuestionnareItemType';
import Select from '../Select/Select';
import { updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import './EnableWhen.css';
import EnableWhenTypes from './EnableWhenTypes/EnableWhenTypes';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: {
        code: string;
        display: string;
    }[];
    linkId: string;
    enableWhen: QuestionnaireItemEnableWhen[];
};

const EnableWhen = ({ getItem, conditionalArray, linkId, enableWhen }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: IEnableWhen[]) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };

    const [currentConditionItem, setCurrentConditionItem] = useState<QuestionnaireItem>();

    return (
        <>
            <p>
                Hvis relevansen for dette spørsmålet er avhgengig av svaret på et tidligere spørsmål, velger dette her.
            </p>
            {enableWhen?.length == 0 && (
                <div className="form-field">
                    <label>Velg tidligere spørsmål</label>
                    <Select
                        placeholder="Velg spørsmål"
                        options={conditionalArray}
                        value={currentConditionItem?.linkId}
                        onChange={(event) => {
                            const copy = { question: event.target.value };
                            setCurrentConditionItem(getItem(event.target.value));
                            dispatchUpdateItemEnableWhen([copy]);
                        }}
                    />
                </div>
            )}

            {enableWhen.map((x, index) => {
                const conditionItem = getItem(x.question);

                if (conditionItem && conditionItem.type) {
                    return (
                        <div key={index}>
                            <div className="form-field">
                                <label>Velg tidligere spørsmål</label>
                                <Select
                                    placeholder="Velg spørsmål"
                                    options={conditionalArray}
                                    value={x.question}
                                    onChange={(event) => {
                                        const copy = { question: event.target.value };
                                        setCurrentConditionItem(getItem(event.target.value));
                                        dispatchUpdateItemEnableWhen([copy]);
                                    }}
                                />
                            </div>
                            <EnableWhenTypes conditionItem={conditionItem} itemEnableWhen={x} linkId={linkId} />
                        </div>
                    );
                }

                return null;
            })}
        </>
    );
};

export default EnableWhen;
