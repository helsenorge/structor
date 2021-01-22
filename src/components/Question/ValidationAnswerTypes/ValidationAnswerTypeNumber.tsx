import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeNumber = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minValue = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueInteger;
    const maxValue = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueInteger;
    const maxDecimalPlaces = item?.extension?.find((x) => x.url === IExtentionType.maxDecimalPlaces)?.valueInteger;
    const isDecimal = item?.type === IQuestionnaireItemType.decimal;

    const dispatchUpdateItemType = (value: IQuestionnaireItemType.decimal | IQuestionnaireItemType.integer) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.type, value));
    };

    const dispatchExtensionUpdate = (value: Extension[]) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, value));
    };

    const dispatchRemoveMaxDecimalsExtension = () => {
        const updatedExtensions = item.extension?.filter(
            (extension: Extension) => extension.url !== IExtentionType.maxDecimalPlaces,
        );
        if (updatedExtensions) {
            dispatchExtensionUpdate([...updatedExtensions]);
        }
    };

    const changeItemType = () => {
        const newItemType =
            item?.type === IQuestionnaireItemType.decimal
                ? IQuestionnaireItemType.integer
                : IQuestionnaireItemType.decimal;

        dispatchUpdateItemType(newItemType);
        if (newItemType === IQuestionnaireItemType.integer) {
            dispatchRemoveMaxDecimalsExtension();
        }
    };

    const updateExtensionInputElement = (url: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const validationTextExtension = {
                url: url,
                valueString: e.target.value,
            };
            const extensionToUpdate = item.extension?.find((ext) => ext.url === validationTextExtension.url);
            const removedExt = item.extension?.filter((ext) => ext.url !== validationTextExtension.url) ?? [];
            const newExtension =
                extensionToUpdate === undefined
                    ? validationTextExtension
                    : { url: extensionToUpdate.url, valueString: e.target.value };

            dispatchExtensionUpdate([...removedExt, newExtension]);
        };
    };

    const updateExtensionNumberElement = (url: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const validationTextExtension = {
                url: url,
                valueInteger: parseInt(e.target.value),
            };
            const extensionToUpdate = item.extension?.find((ext) => ext.url === validationTextExtension.url);
            const removedExt = item.extension?.filter((ext) => ext.url !== validationTextExtension.url) ?? [];
            const newExtension =
                extensionToUpdate === undefined
                    ? validationTextExtension
                    : { url: extensionToUpdate.url, valueInteger: parseInt(e.target.value) };

            dispatchExtensionUpdate([...removedExt, newExtension]);
        };
    };

    return (
        <>
            <div className="horizontal equal">
                <div className="form-field">
                    <SwitchBtn label="Tillat desimaltall" initial value={isDecimal} onClick={changeItemType} />
                </div>
                {isDecimal && (
                    <div className="form-field">
                        <label className="#">Max antall desimaler</label>
                        <input
                            type="number"
                            defaultValue={maxDecimalPlaces}
                            onChange={updateExtensionNumberElement(IExtentionType.maxDecimalPlaces)}
                        />
                    </div>
                )}
            </div>

            <div className="horizontal equal">
                <div className="form-field" id="number">
                    <label className="#">Min verdi</label>
                    <input
                        type="number"
                        defaultValue={minValue}
                        onChange={updateExtensionNumberElement(IExtentionType.minValue)}
                    ></input>
                </div>

                <div className="form-field" id="number">
                    <label className="#">Max verdi</label>
                    <input
                        type="number"
                        defaultValue={maxValue}
                        onChange={updateExtensionNumberElement(IExtentionType.maxValue)}
                    ></input>
                </div>
            </div>

            <div className="form-field custom-input-error-message">
                <label className="#">Legg til egendefinert feilmelding:</label>
                <input
                    type="input"
                    defaultValue={validationText}
                    placeholder="feilmelding"
                    onChange={updateExtensionInputElement(IExtentionType.validationtext)}
                ></input>
            </div>
        </>
    );
};

export default ValidationAnswerTypeNumber;
