import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../../store/treeStore/treeStore';
import {
    QuestionnaireItem,
    ValueSetComposeIncludeConcept,
    Extension,
    QuestionnaireItemEnableWhen,
} from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { ItemControlType, setItemControlExtension } from '../../../helpers/itemControl';
import { IItemProperty, IExtentionType, IOperator, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { setItemExtension, removeItemExtension, getExtensionStringValue } from '../../../helpers/extensionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';

type CopyFromProps = {
    item: QuestionnaireItem;
    conditionalArray: ValueSetComposeIncludeConcept[];
    isDataReceiver: boolean;
    canTypeBeReadonly: boolean;
    dataReceiverStateChanger: React.Dispatch<React.SetStateAction<boolean>>;
    getItem: (linkId: string) => QuestionnaireItem;
};

const getLinkIdFromValueString = (item: QuestionnaireItem): string => {
    const extensionValueString = getExtensionStringValue(item, IExtentionType.copyExpression) ?? '';
    const startIndex = extensionValueString.indexOf("'") + 1;
    const endIndex = extensionValueString.indexOf("')");
    return extensionValueString.substring(startIndex, endIndex);
};

const CopyFrom = (props: CopyFromProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const getSelectedValue = () => props.conditionalArray.find((f) => f.code === getLinkIdFromValueString(props.item));
    const [selectedValue, setSelectedvalue] = useState(getSelectedValue());

    const filterWithRepeats = (value: ValueSetComposeIncludeConcept) => {
        const item = props.getItem(value.code);
        return item.type === props.item.type && item.repeats === props.item.repeats;
    };

    const questionsOptions = () => {
        return props.conditionalArray.filter((f) => filterWithRepeats(f));
    };

    const removeCopyExpression = () => removeItemExtension(props.item, IExtentionType.copyExpression, dispatch);
    const updateReadonlyItem = (value: boolean) => {
        if (props.canTypeBeReadonly) {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.readOnly, value));
        }
    };
    const updateEnableWhen = (selectedValue: ValueSetComposeIncludeConcept | undefined) => {
        const initEnableWhen: QuestionnaireItemEnableWhen[] = [];
        const enableWhen = props.item.enableWhen?.map((ew: QuestionnaireItemEnableWhen) => ew) || initEnableWhen;
        if (selectedValue) {
            enableWhen.push({
                answerBoolean: true,
                question: selectedValue.code,
                operator: props.item.type === IQuestionnaireItemType.boolean ? '=' : IOperator.exists,
            } as QuestionnaireItemEnableWhen);
        }
        dispatch(updateItemAction(props.item.linkId, IItemProperty.enableWhen, enableWhen));
    };

    useEffect(() => {
        if (!props.isDataReceiver) {
            removeCopyExpression();
            setSelectedvalue(undefined);
        } else {
            updateReadonlyItem(props.isDataReceiver);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isDataReceiver]);

    const onChangeSwitchBtn = async (): Promise<void> => {
        setItemControlExtension(props.item, ItemControlType.dataReceiver, dispatch);
        props.dataReceiverStateChanger(!props.isDataReceiver);
    };

    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const extension: Extension = {
            url: IExtentionType.copyExpression,
            valueString: `QuestionnaireResponse.descendants().where(linkId='${event.target.value}').answer.value`,
        };
        const selectedCondition = props.conditionalArray.find((f) => f.code === event.target.value);
        setItemExtension(props.item, extension, dispatch);
        updateEnableWhen(selectedCondition);
        setSelectedvalue(selectedCondition);
    };

    return (
        <div className="horizontal equal">
            <FormField>
                <SwitchBtn
                    onChange={onChangeSwitchBtn}
                    value={props.isDataReceiver}
                    label={t('Retrieve input data from field')}
                />
            </FormField>
            {props.isDataReceiver && (
                <FormField label={t('Select earlier question:')}>
                    <Select
                        placeholder={t('Choose question:')}
                        options={questionsOptions()}
                        value={selectedValue?.code}
                        onChange={(event) => onChangeSelect(event)}
                    />
                </FormField>
            )}
        </div>
    );
};

export default CopyFrom;
