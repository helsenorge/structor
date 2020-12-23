import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IItemProperty, IExtentionType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem, Extension } from '../../../types/fhir';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeNumber = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minValue = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueInteger;
    const maxValue = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueInteger;
    // const maxDecimalPlaces = item?.extension?.find((x) => x.url === IValidationType.maxDecimalPlaces)?.valueInteger;

    const dispatchExtentionUpdate = (value: Extension[]) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, value));
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

            dispatchExtentionUpdate([...removedExt, newExtension]);
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

            dispatchExtentionUpdate([...removedExt, newExtension]);
        };
    };

    // const updateExtensionDesimal = (url: string) => {
    //     return (e: React.ChangeEvent<HTMLInputElement>) => {
    //         const validationCheckboxextension = {
    //             url: url,
    //             valueInteger: parseInt(e.target.value),
    //         };
    //         const extensionToUpdate = item.extension?.find((ext) => ext.url === validationCheckboxextension.url);
    //         const removedExt = item.extension?.filter((ext) => ext.url !== validationCheckboxextension.url) ?? [];
    //         const newExtension =
    //             extensionToUpdate === undefined
    //                 ? validationCheckboxextension
    //                 : { url: extensionToUpdate.url, valueInteger: parseInt(e.target.value) };
    //         dispatchExtentionUpdate([...removedExt, newExtension]);
    //     };
    // };

    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst</p>
            </div>

            {/* <div className="horizontal">
                <div className="form-field" id="allow-decimal">
                    <label>Tillat desimaltall</label>
                    <input
                        type="number"
                        defaultValue={maxDecimalPlaces || 0}
                        onChange={updateExtensionDesimal('http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces')}
                    />
                </div>
            </div> */}

            <div className="horizontal">
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

            {/* <div className="form-field">
                <a
                    href="#"
                    onClick={() => {
                        //TODO
                    }}
                >
                    + Legg til kriterie
                </a>
            </div> */}

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
