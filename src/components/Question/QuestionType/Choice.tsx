import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import React, { useContext } from 'react';
import {
    addEmptyOptionToAnswerOptionArray,
    removeOptionFromAnswerOptionArray,
    updateAnswerOption,
} from '../../../helpers/answerOptionHelper';

import Btn from '../../Btn/Btn';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import RadioBtn from '../../RadioBtn/RadioBtn';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension } from '../../../helpers/QuestionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qContained } = state;

    const dispatchExtentionUpdate = () => {
        if (item.extension && item.extension.length > 0) {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, []));
        } else {
            dispatch(updateItemAction(item.linkId, IItemProperty.extension, checkboxExtension));
        }
    };

    const getContainedValueSetValues = (valueSetId: string): Array<{ system?: string; display?: string }> => {
        const valueSet = qContained?.find((x) => `#${x.id}` === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const renderValueSetValues = (): JSX.Element => {
        return (
            <>
                {item.answerValueSet && item.answerValueSet.startsWith('#') && (
                    <div>
                        <p>Dette spørsmålet bruker følgende innebygde verdier, som ikke kan endres i skjemabyggeren:</p>
                        {getContainedValueSetValues(item.answerValueSet).map((x, index) => {
                            return (
                                <RadioBtn name={x.system} key={index} disabled showDelete={false} value={x.display} />
                            );
                        })}
                    </div>
                )}
                {item.answerValueSet && item.answerValueSet.startsWith('http') && (
                    <div>{`Dette spørsmålet henter verdier fra ${item.answerValueSet}`}</div>
                )}
            </>
        );
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const renderRadioBtn = (answerOption: QuestionnaireItemAnswerOption, index: number): JSX.Element => {
        return (
            <RadioBtn
                name={answerOption.valueCoding.system}
                key={index}
                showDelete={index > 1}
                value={answerOption.valueCoding.display}
                onChange={(event) => {
                    const newArray = updateAnswerOption(
                        item.answerOption || [],
                        answerOption.valueCoding.code || '',
                        event.target.value,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                deleteItem={() => {
                    const newArray = removeOptionFromAnswerOptionArray(
                        item.answerOption || [],
                        answerOption.valueCoding.code || '',
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
            />
        );
    };

    return (
        <>
            <div className="form-field">
                <SwitchBtn
                    label="Flere valg mulig"
                    onChange={() => dispatchExtentionUpdate()}
                    initial
                    value={item.extension !== undefined && item.extension.length > 0}
                />
                {item.answerValueSet && !item.answerOption && renderValueSetValues()}
                {item.answerOption?.map((answerOption, index) => renderRadioBtn(answerOption, index))}
            </div>
            {!item.answerValueSet && (
                <Btn
                    title="+ Legg til alternativ"
                    type="button"
                    onClick={() => {
                        const newArray = addEmptyOptionToAnswerOptionArray(item.answerOption || []);
                        dispatchUpdateItem(IItemProperty.answerOption, newArray);
                    }}
                    variant="secondary"
                    size="small"
                />
            )}
        </>
    );
};

export default Choice;
