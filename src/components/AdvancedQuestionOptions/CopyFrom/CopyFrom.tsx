import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSetComposeIncludeConcept, Extension } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { ItemControlType, setItemControlExtension, isItemControlDataReciever } from '../../../helpers/itemControl';
import { IItemProperty, IExtentionType } from '../../../types/IQuestionnareItemType';
import { setItemExtension, getExtensionStringValue } from '../../../helpers/extensionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';

type CopyFromProps = {
    item: QuestionnaireItem;
    conditionalArray: ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
};

const CopyFrom = (props: CopyFromProps): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const hasDataReciverExtension = isItemControlDataReciever(props.item);
    const questionsOptions = props.conditionalArray.filter((f) => props.getItem(f.code).type === props.item.type);

    const getLinkIdFromValueString = (): string => {
        const extensionValueString = getExtensionStringValue(props.item, IExtentionType.kopieringExpression) ?? '';
        const startIndex = extensionValueString.indexOf("'") + 1;
        const endIndex = extensionValueString.indexOf("')");
        return extensionValueString.substring(startIndex, endIndex);
    };

    const onChangeBtn = (): void => {
        setItemControlExtension(props.item, ItemControlType.dataReciever, dispatch);
        dispatch(updateItemAction(props.item.linkId, IItemProperty.readOnly, !props.item.readOnly));
    };

    const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const extension: Extension = {
            url: IExtentionType.kopieringExpression,
            valueString: `QuestionnaireResponse.descendants().where(linkId='${event.target.value}').answer.value.valueString`,
        };
        setItemExtension(props.item, extension, dispatch);
    };
    const selectedValue = props.conditionalArray.find((f) => f.code === getLinkIdFromValueString());

    return (
        <div className="horizontal equal">
            <FormField>
                <SwitchBtn
                    onChange={onChangeBtn}
                    value={hasDataReciverExtension}
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
