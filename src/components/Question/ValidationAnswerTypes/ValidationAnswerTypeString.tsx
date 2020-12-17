import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import Select from '../../Select/Select';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeString = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = (value: any) => {
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

    const updateExtensionSelectElement = (e: any) => {
        switch (e) {
            case 'EpostRegX':
                return dispatchExtentionUpdate([
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/regex',
                        valueString: 'EpostRegX',
                    },
                ]);
            case 'ULRRegX':
                return dispatchExtentionUpdate([
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/regex',
                        valueString: 'ULRRegX',
                    },
                ]);
            case 'BirthRegX':
                return dispatchExtentionUpdate([
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/regex',
                        valueString: 'BirthRegX',
                    },
                ]);
            case 'PostRegX':
                return dispatchExtentionUpdate([
                    {
                        url: 'http://hl7.org/fhir/StructureDefinition/regex',
                        valueString: 'PostRegX',
                    },
                ]);

            default:
                return alert(e + ' = missing');
        }
    };

    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst - kortsvar</p>
            </div>

            <div className="form-field half">
                <label className="#">Din epost:</label>
                <Select
                    options={[
                        { display: 'Velg kriterie', code: '0' },
                        { display: 'Epost', code: 'EpostRegX' },
                        { display: 'URL', code: 'ULRRegX' },
                        { display: 'Fødselsnummer', code: 'BirthRegX' },
                        { display: 'Postnummer', code: 'PostRegX' },
                    ]}
                    value={''}
                    onChange={(e) => {
                        updateExtensionSelectElement(e.currentTarget.value);
                    }}
                ></Select>
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

export default ValidationAnswerTypeString;
