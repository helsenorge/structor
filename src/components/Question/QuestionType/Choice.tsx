import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
    addEmptyOptionToAnswerOptionArray,
    createNewAnswerOption,
    updateAnswerOptionSystem,
} from '../../../helpers/answerOptionHelper';

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../../types/fhir';
import Btn from '../../Btn/Btn';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { checkboxExtension, dropdownExtension } from '../../../helpers/QuestionHelper';
import { removeItemAttributeAction, updateItemAction } from '../../../store/treeStore/treeActions';

import SystemField from '../../FormField/SystemField';
import { isItemControlCheckbox, isItemControlDropDown, ItemControlType } from '../../../helpers/itemControl';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import FormField from '../../FormField/FormField';
import ChoiceTypeSelect from './ChoiceTypeSelect';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { createSystemUUID } from '../../../helpers/systemHelper';
import DraggableAnswerOptions from '../../AnswerOption/DraggableAnswerOptions';
import PredefinedValueSets from './PredefinedValueSets';

type Props = {
    item: QuestionnaireItem;
};

const Choice = ({ item }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch, state } = useContext(TreeContext);
    const { qContained } = state;

    const dispatchExtentionUpdate = (type: ItemControlType) => {
        removeItemExtension(item, IExtentionType.itemControl, dispatch);
        if (type === ItemControlType.checkbox && !isItemControlCheckbox(item)) {
            setItemExtension(item, checkboxExtension, dispatch);
        } else if (type === ItemControlType.dropdown && !isItemControlDropDown(item)) {
            setItemExtension(item, dropdownExtension, dispatch);
        }
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => {
        dispatch(updateItemAction(item.linkId, name, value));
    };

    const dispatchRemoveAttribute = (name: IItemProperty): void => {
        dispatch(removeItemAttributeAction(item.linkId, name));
    };

    const handleChangeSystem = (system: string) => {
        const alteredAnswerOption = updateAnswerOptionSystem(item.answerOption || [], system);
        dispatchUpdateItem(IItemProperty.answerOption, alteredAnswerOption);
    };

    return (
        <>
            <ChoiceTypeSelect item={item} dispatchExtentionUpdate={dispatchExtentionUpdate} />
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        const newType =
                            item.type === IQuestionnaireItemType.openChoice
                                ? IQuestionnaireItemType.choice
                                : IQuestionnaireItemType.openChoice;
                        dispatchUpdateItem(IItemProperty.type, newType);
                    }}
                    value={item.type === IQuestionnaireItemType.openChoice}
                    label={t('Allow free-text answer')}
                />
            </FormField>
            <FormField>
                <SwitchBtn
                    onChange={() => {
                        if (!!item.answerValueSet) {
                            const system = createSystemUUID();
                            dispatchRemoveAttribute(IItemProperty.answerValueSet);
                            dispatchUpdateItem(IItemProperty.answerOption, [
                                createNewAnswerOption(system),
                                createNewAnswerOption(system),
                            ]);
                        } else {
                            dispatchRemoveAttribute(IItemProperty.answerOption);
                            dispatchUpdateItem(IItemProperty.answerValueSet, '#');
                        }
                    }}
                    value={!!item.answerValueSet}
                    label={t('Use predefined valueset')}
                />
            </FormField>
            {!!item.answerValueSet ? (
                <PredefinedValueSets item={item} qContained={qContained} dispatchUpdateItem={dispatchUpdateItem} />
            ) : (
                <>
                    <SystemField
                        value={
                            item.answerOption && item.answerOption.length > 0
                                ? item.answerOption[0]?.valueCoding?.system
                                : ''
                        }
                        onBlur={(event) => handleChangeSystem(event.target.value)}
                    />
                    <FormField>
                        {item.answerOption && item.answerOption?.length > 0 && (
                            <DraggableAnswerOptions item={item} dispatchUpdateItem={dispatchUpdateItem} />
                        )}
                    </FormField>
                    <div className="center-text">
                        <Btn
                            title={t('+ Add option')}
                            type="button"
                            onClick={() => {
                                const newArray = addEmptyOptionToAnswerOptionArray(item.answerOption || []);
                                dispatchUpdateItem(IItemProperty.answerOption, newArray);
                            }}
                            variant="secondary"
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default Choice;
