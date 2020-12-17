import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeText = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = (value: any) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, value));
    };

    const dispatchUpdateItem = (name: IItemProperty, value: string | boolean) => {
        dispatch(updateItemAction(item.linkId, name, value));
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

    const updateExtensionNumberElement = (url: IItemProperty) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const a = parseInt(e.target.value.toString());
            console.log(typeof a);
            dispatchUpdateItem(url, e.target.value);
        };
    };

    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst for Langsvar</p>
            </div>

            <div className="form-field" id="number">
                <label className="#">Minimum antall tegn</label>
                <input type="input" onChange={updateExtensionNumberElement(IItemProperty.minLength)}></input>
            </div>

            <div className="form-field" id="number">
                <label className="#">Maximum antall tegn</label>
                <input type="input" onChange={updateExtensionNumberElement(IItemProperty.maxLength)}></input>
            </div>

            <div className="form-field custom-input-error-message">
                <label className="#">Legg til egendefinert feilmelding:</label>
                <input
                    type="input"
                    placeholder="feilmelding"
                    onChange={updateExtensionInputElement('http://ehelse.no/fhir/StructureDefinition/validationtext')}
                ></input>
            </div>
        </>
    );
};

export default ValidationAnswerTypeText;
