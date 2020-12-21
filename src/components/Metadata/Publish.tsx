import React, { useContext } from 'react';
import FormField from '../FormField/FormField';
import { metadataOperators, metadataLanguage } from '../../helpers/MetadataHelper';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Btn from '../Btn/Btn';
import Select from '../Select/Select';
import './Publish.css';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';

type props = {
    openModal: () => void;
};

const Publish = ({ openModal }: props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const { qMetadata } = state;

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <div id="admin-menu">
            <FormField label="Status">
                <Select
                    value={qMetadata.status || ''}
                    options={metadataOperators}
                    onChange={(e) => updateMeta(IQuestionnaireMetadataType.status, e.target.value)}
                ></Select>
            </FormField>
            <FormField label="Utsteder">
                <input
                    value={qMetadata.publisher || ''}
                    onChange={(e) => updateMeta(IQuestionnaireMetadataType.publisher, e.target.value)}
                />
            </FormField>
            <FormField label="Språk">
                <Select
                    value={qMetadata.language || ''}
                    options={metadataLanguage}
                    onChange={(e) => updateMeta(IQuestionnaireMetadataType.language, e.target.value)}
                ></Select>
            </FormField>
            <FormField label="Endepunkt">
                <input
                    value={qMetadata.url || ''}
                    onChange={(e) => updateMeta(IQuestionnaireMetadataType.url, e.target.value)}
                />
            </FormField>
            <FormField label="ID">
                <input
                    value={qMetadata?.id || ''}
                    onChange={(e) => updateMeta(IQuestionnaireMetadataType.id, e.target.value)}
                />
            </FormField>
            <FormField label="">
                <Btn title="Publiser" id="btn-blue" onClick={openModal} />
            </FormField>
        </div>
    );
};

export default Publish;
