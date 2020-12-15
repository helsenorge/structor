import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableWhen, ValueSetComposeIncludeConcept } from '../../types/fhir';
import { IEnableWhen, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import { updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { operator } from '../../helpers/QuestionHelper';
import './EnableWhen.css';

type Props = {
    getValueSet: (linkId: string) => ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: {
        code: string;
        display: string;
    }[];
    linkId: string;
    enableWhen: QuestionnaireItemEnableWhen[];
};

const Conditional = ({ getItem, conditionalArray, linkId, enableWhen, getValueSet }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: IEnableWhen[]) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };

    const [currentConditionItem, setCurrentConditionItem] = useState<QuestionnaireItem>();

    const getEnableWhenWidget = (conditionItem: QuestionnaireItem, itemEnableWhen: QuestionnaireItemEnableWhen) => {
        const param = conditionItem.type;

        switch (param) {
            case IQuestionnaireItemType.integer:
                return (
                    <>
                        <div className="horizontal equal">
                            <FormField label="Vis hvis svaret er:">
                                <Select
                                    placeholder="Velg en operator"
                                    options={operator}
                                    value={itemEnableWhen?.operator}
                                    onChange={(e) => {
                                        const copy = { ...itemEnableWhen, operator: e.currentTarget.value };
                                        dispatchUpdateItemEnableWhen([copy]);
                                    }}
                                />
                            </FormField>
                            <FormField label="Tall">
                                <input
                                    type="number"
                                    defaultValue={itemEnableWhen?.answerInteger}
                                    onChange={(e) => {
                                        const copy = {
                                            ...itemEnableWhen,
                                            answerInteger: parseInt(e.currentTarget.value),
                                        };
                                        dispatchUpdateItemEnableWhen([copy]);
                                    }}
                                />
                            </FormField>
                        </div>
                        <div className="infobox">
                            <p>Spørsmålet vil vises dersom svaret på:</p>
                            <p>
                                <strong>{conditionItem.text}</strong>{' '}
                                {operator.find((x) => x.code === itemEnableWhen?.operator)?.display.toLocaleLowerCase()}{' '}
                                <strong>{itemEnableWhen?.answerInteger}</strong>
                            </p>
                        </div>
                    </>
                );
            case IQuestionnaireItemType.choice:
                const choices = getValueSet(conditionItem.linkId);

                return (
                    <>
                        <FormField label="Hvis hvis svaret er:">
                            <Select
                                placeholder="Velg et alternativ.."
                                options={choices}
                                value={itemEnableWhen?.operator}
                                onChange={(e) => {
                                    console.log('todo', e.target.value);
                                }}
                            />
                        </FormField>
                    </>
                );
            default:
                return <p>TODO</p>;
        }
    };

    return (
        <>
            <p>
                Hvis relevansen for dette spørsmålet er avhgengig av svaret på et tidligere spørsmål, velger dette her.{' '}
                Antall {enableWhen.length}
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
                        {getEnableWhenWidget(getItem(x.question), x)}
                    </div>
                );
            })}
        </>
    );
};

export default Conditional;
