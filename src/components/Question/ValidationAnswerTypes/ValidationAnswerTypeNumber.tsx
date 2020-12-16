import React, { useContext } from 'react';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IItemProperty } from '../../../types/IQuestionnareItemType';
import Select from '../../Select/Select';
import { QuestionnaireItem } from '../../../types/fhir';
import itemType, { checkboxExtension } from '../../../helpers/QuestionHelper';

interface ValidationTypeProp {
    item: QuestionnaireItem;
    //TYPES
}

const ValidationAnswerTypeNumber = ({ item }: ValidationTypeProp): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = (value: any) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.extension, value));
    };

    const Eventhandler = (url: string) => {
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

    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst</p>
            </div>

            <div className="allow-decimal">
                <input
                    type="checkbox"
                    onChange={() => {
                        // TODO
                    }}
                />
                <span> Tillat desimaltall</span>
            </div>

            <div className="form-field">
                <label className="#">Svaret skal være:</label>
                <Select
                    placeholder="Velg kriterie"
                    options={[
                        { display: 'Større enn eller er lik', code: 'biggerThen' },
                        { display: 'Mindre enn eller er lik', code: 'smallerThen' },
                    ]}
                    onChange={(e) => {
                        const copy = {
                            url: 'checkbox',
                            valueBoolean: false,
                        };
                        //TODO
                    }}
                ></Select>
            </div>

            {/* SHOW WHEN SELECED A VALUE */}
            <div className="form-field">
                <label className="#">Skriv inn ett tall:</label>
                <input
                    type="input"
                    placeholder="5"
                    onChange={(e) => {
                        const copy = { ...item.extension, url: 'Type', valueInteger: e.currentTarget.value };
                        dispatchExtentionUpdate([copy]);
                    }}
                ></input>
            </div>

            <div className="form-field">
                <a
                    href="#"
                    onClick={() => {
                        //TODO
                    }}
                >
                    + Legg til kriterie
                </a>
            </div>

            <div className="form-field custom-input-error-message">
                <label className="#">Legg til egendefinert feilmelding:</label>
                <input type="input" placeholder="feilmelding" onChange={Eventhandler('ErrorText')}></input>
            </div>
        </>
    );
};

export default ValidationAnswerTypeNumber;
