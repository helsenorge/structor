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
import { IItemProperty, IExtentionType, IOperator } from '../../../types/IQuestionnareItemType';
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
    const [selectedValue, setSelectedvalue] = useState(getSelectedValue()?.code ?? '');
    const questionsOptions = props.conditionalArray.filter((f) => props.getItem(f.code).type === props.item.type);

    const updateReadonlyItem = (value: boolean) => {
        if (props.canTypeBeReadonly) {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.readOnly, value));
        }
    };

    const updateEnableWhen = (selectedValue: string) => {
        const enableWhen =
            selectedValue !== ''
                ? [
                      {
                          answerBoolean: true,
                          question: selectedValue,
                          operator: IOperator.exists,
                      } as QuestionnaireItemEnableWhen,
                  ]
                : [];
        dispatch(updateItemAction(props.item.linkId, IItemProperty.enableWhen, enableWhen));
    };

    const setCalculationExpression = (code: string) => {
        const calculatedExpression =
            getExtensionStringValue(props.getItem(code), IExtentionType.calculatedExpression) ?? '';
        if (calculatedExpression) {
            const ceExtension: Extension = {
                url: IExtentionType.calculatedExpression,
                valueString: calculatedExpression,
            };
            setItemExtension(props.item, ceExtension, dispatch);
        } else {
            removeItemExtension(props.item, IExtentionType.calculatedExpression, dispatch);
        }
    };

    const setDataReceiverExtenssion = (code: string) => {
        const extension: Extension = {
            url: IExtentionType.copyExpression,
            valueString: `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value`,
        };
        setItemExtension(props.item, extension, dispatch);
    };

    useEffect(() => {
        if (!props.isDataReceiver) {
            removeItemExtension(props.item, IExtentionType.copyExpression, dispatch);
            setSelectedvalue('');
        } else {
            updateReadonlyItem(props.isDataReceiver);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isDataReceiver]);

    useEffect(() => {
        setCalculationExpression(selectedValue);
        updateEnableWhen(selectedValue);
    }, [selectedValue]);

    const onChangeSwitchBtn = async (): Promise<void> => {
        setItemControlExtension(props.item, ItemControlType.dataReceiver, dispatch);
        props.dataReceiverStateChanger(!props.isDataReceiver);
    };

    const onChangeSelect = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const code = event.target.value;
        setSelectedvalue(code);
        setDataReceiverExtenssion(code);
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
                        options={questionsOptions}
                        value={selectedValue}
                        onChange={(event) => onChangeSelect(event)}
                    />
                </FormField>
            )}
        </div>
    );
};

export default CopyFrom;
