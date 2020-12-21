import React from 'react';
import FormField from '../../components/FormField/FormField';
import { metadataOperators } from '../../helpers/MetadataHelper';
import { IQuestionnaireMetadata } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import Select from '../Select/Select';

type props = {
    metadata: IQuestionnaireMetadata;
};

const Administrator = ({ metadata }: props): JSX.Element => {
    const MetaAuthor = metadata.publisher;
    const language = metadata.meta?.tag?.[0].display;

    return (
        <div id="admin-menu">
            <FormField label="Status">
                <Select options={metadataOperators} onChange={() => alert('changed')}></Select>
            </FormField>
            <FormField label="ID">
                <input defaultValue="X" />
            </FormField>
            <FormField label="Forfatter">
                <input defaultValue={MetaAuthor} onChange={() => alert('update metadata')} />
            </FormField>
            <FormField label="Endepunkt">
                <input defaultValue="X" />
            </FormField>
            <FormField label="Språk">
                <input defaultValue={language} onChange={() => alert('update metadata')} />
            </FormField>

            <Btn title="Se mer" id="btn-black" onClick={() => alert()} />
        </div>
    );
};

export default Administrator;
