import React from 'react';
import FormField from '../FormField/FormField';
import { metadataOperators, metadataLanguage } from '../../helpers/MetadataHelper';
import { IQuestionnaireMetadata } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import Select from '../Select/Select';

type props = {
    metadata: IQuestionnaireMetadata;
};

const Publish = ({ metadata }: props): JSX.Element => {
    const MetaAuthor = metadata.publisher;

    return (
        <div id="admin-menu">
            <FormField label="Status">
                <Select options={metadataOperators} onChange={() => alert('changed')}></Select>
            </FormField>
            <FormField label="Utsteder">
                <input defaultValue={MetaAuthor} onChange={() => alert('update metadata')} />
            </FormField>
            <FormField label="Språk">
                <Select options={metadataLanguage} onChange={() => alert('update metadata')}></Select>
            </FormField>
            <FormField label="Endepunkt">
                <input defaultValue="X" onChange={() => alert('update metadata')} />
            </FormField>
            <FormField label="ID">
                <input defaultValue="X" onChange={() => alert('update metadata')} />
            </FormField>
            <FormField label="URL">
                <input defaultValue="X" onChange={() => alert('update metadata')} />
            </FormField>
            <FormField>
                <Btn title="Publiser" id="btn-blue" onClick={() => alert()} />
            </FormField>
        </div>
    );
};

export default Publish;
