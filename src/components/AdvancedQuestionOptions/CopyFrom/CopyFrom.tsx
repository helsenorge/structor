import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept, Extension } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { ItemControlType, setItemControlExtension } from '../../../helpers/itemControl';
import { IItemProperty, IExtentionType, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
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
    const extensionValueString = getExtensionStringValue(item, IExtentionType.kopieringExpression) ?? '';
    const startIndex = extensionValueString.indexOf("'") + 1;
    const endIndex = extensionValueString.indexOf("')");
    return extensionValueString.substring(startIndex, endIndex);
};

const CopyFrom = (props: CopyFromProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const selectedValue = props.conditionalArray.find((f) => f.code === getLinkIdFromValueString(props.item));
    const questionsOptions = props.conditionalArray.filter((f) => props.getItem(f.code).type === props.item.type);

    const updateReadonlyItem = (value: boolean) => {
        if (props.canTypeBeReadonly) {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.readOnly, value));
        }
    };

    useEffect(() => {
        if (!props.isDataReceiver) {
            removeItemExtension(props.item, IExtentionType.kopieringExpression, dispatch);
        }
        updateReadonlyItem(props.isDataReceiver);
    }, [props.isDataReceiver]);

    const onChangeSwitchBtn = async (): Promise<void> => {
        setItemControlExtension(props.item, ItemControlType.dataReceiver, dispatch);
        props.dataReceiverStateChanger(!props.isDataReceiver);
    };

    const getCorrectValue = (code: string): string => {
        switch (props.item.type) {
            case IQuestionnaireItemType.integer:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueInteger`;
            case IQuestionnaireItemType.quantity:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.value`;
            case IQuestionnaireItemType.decimal:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueDecimal`;
            case IQuestionnaireItemType.date:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueDateTime`;
            case IQuestionnaireItemType.time:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueTime`;
            case IQuestionnaireItemType.text:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueString`;
            default:
                return `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value.valueCoding.system`;
        }
    };

    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const extension: Extension = {
            url: IExtentionType.kopieringExpression,
            valueString: getCorrectValue(event.target.value),
        };
        setItemExtension(props.item, extension, dispatch);
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
            <FormField label={t('Select earlier question:')}>
                <Select
                    placeholder={t('Choose question:')}
                    options={questionsOptions}
                    value={selectedValue?.display}
                    onChange={(event) => onChangeSelect(event)}
                />
            </FormField>
        </div>
    );
};

export default CopyFrom;
