import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../types/fhir';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import './Conditional.css';
import { updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: {
        code: string;
        display: string;
    }[];
    linkId: string;
};

type EnableWhen = {
    question?: string;
    operator?: string;
    answerInteger?: number;
};

const Conditional = ({ getItem, conditionalArray, linkId }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: QuestionnaireItemEnableWhen[]) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };

    const [currentItem, setCurrentItem] = useState<QuestionnaireItem>();
    const [enableWhen, setEnableWhen] = useState<EnableWhen>();
    const [condition, setCondition] = useState<string>();

    const options = [
        {
            code: 'exists',
            display: 'Eksisterer',
        },
        {
            code: '!=',
            display: 'Er lik',
        },
        {
            code: '>',
            display: 'Større enn',
        },
        {
            code: '<',
            display: 'Mindre enn',
        },
        {
            code: '>=',
            display: 'Større enn eller lik',
        },
        {
            code: '<=',
            display: 'Mindre enn eller lik',
        },
    ];

    return (
        <>
            <p>
                Hvis relevansen for dette spørsmålet er avhgengig av svaret på et tidligere spørsmål, velger dette her.{' '}
            </p>
            <div className="form-field">
                <label>Velg tidligere spørsmål</label>
                <Select
                    placeholder="Velg spørsmål"
                    options={conditionalArray}
                    value={currentItem?.linkId}
                    onChange={(event) => {
                        setCurrentItem(getItem(event.target.value));
                        dispatchUpdateItemEnableWhen([]);
                    }}
                />
            </div>

            {currentItem?.type === IQuestionnaireItemType.integer && (
                <>
                    <div className="horizontal equal">
                        <FormField label="Vis hvis svaret er:">
                            <Select
                                options={options}
                                onChange={(e) => {
                                    const copy = { ...enableWhen };
                                    copy.operator = e.target.value;
                                    setEnableWhen(copy);
                                }}
                            />
                        </FormField>
                        <FormField label="Tall">
                            <input type="number" onChange={(e) => setCondition(e.target.value)} />
                        </FormField>
                    </div>
                    <div className="infobox">
                        <p>Spørsmålet vil vises dersom svaret på:</p>
                        <p>
                            <strong>{currentItem.text}</strong>{' '}
                            {options.find((x) => x.code === enableWhen?.operator)?.display.toLocaleLowerCase()}{' '}
                            <strong>{condition}</strong>
                        </p>
                    </div>
                </>
            )}

            {currentItem?.type !== IQuestionnaireItemType.integer && <p>TODO</p>}
        </>
    );
};

export default Conditional;
