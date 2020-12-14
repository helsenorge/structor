import React, { useContext, useState } from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../types/fhir';
import { IEnableWhen, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import { updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import { operator } from '../../helpers/QuestionHelper';
import './EnableWhen.css';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: {
        code: string;
        display: string;
    }[];
    linkId: string;
    enableWhen: QuestionnaireItemEnableWhen[] | undefined;
};

const Conditional = ({ getItem, conditionalArray, linkId }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: IEnableWhen[]) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };

    const [currentItem, setCurrentItem] = useState<QuestionnaireItem>();
    const [enableWhen, setEnableWhen] = useState<IEnableWhen>();
    const [condition, setCondition] = useState<string>();

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
                        const copy = { ...enableWhen, question: event.target.value };
                        setEnableWhen(copy);
                        setCurrentItem(getItem(event.target.value));
                        dispatchUpdateItemEnableWhen([copy]);
                    }}
                />
            </div>

            {currentItem?.type === IQuestionnaireItemType.integer && (
                <>
                    <div className="horizontal equal">
                        <FormField label="Vis hvis svaret er:">
                            <Select
                                options={operator}
                                onChange={(e) => {
                                    const copy = { ...enableWhen, operator: e.currentTarget.value };
                                    setEnableWhen(copy);
                                    dispatchUpdateItemEnableWhen([copy]);
                                }}
                            />
                        </FormField>
                        <FormField label="Tall">
                            <input
                                type="number"
                                onChange={(e) => {
                                    const copy = { ...enableWhen, answerInteger: parseInt(e.currentTarget.value) };
                                    setEnableWhen(copy);
                                    dispatchUpdateItemEnableWhen([copy]);
                                    setCondition(e.target.value);
                                }}
                            />
                        </FormField>
                    </div>
                    <div className="infobox">
                        <p>Spørsmålet vil vises dersom svaret på:</p>
                        <p>
                            <strong>{currentItem.text}</strong>{' '}
                            {operator.find((x) => x.code === enableWhen?.operator)?.display.toLocaleLowerCase()}{' '}
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
