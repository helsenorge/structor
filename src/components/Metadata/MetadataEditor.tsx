import React, { useContext } from 'react';
import FormField from '../FormField/FormField';
import { metadataOperators, metadataLanguage } from '../../helpers/MetadataHelper';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import Select from '../Select/Select';
import './MetadataEditor.css';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import Accordion from '../Accordion/Accordion';

const MetadataEditor = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);

    const { qMetadata } = state;

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <div id="metadata-editor">
            <Accordion title="Skjemadetaljer">
                <FormField label="Id">
                    <input
                        value={qMetadata.id || ''}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.id, e.target.value)}
                    />
                </FormField>
                <FormField label="Språk">
                    <Select
                        value={qMetadata.language || ''}
                        options={metadataLanguage}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.language, e.target.value)}
                    ></Select>
                </FormField>
                <FormField label="Navn">
                    <input
                        value={qMetadata.name || ''}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.name, e.target.value)}
                    />
                </FormField>
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
                <FormField label="Formål">
                    <MarkdownEditor
                        data={qMetadata.purpose || ''}
                        onChange={(purpose: string) => updateMeta(IQuestionnaireMetadataType.purpose, purpose)}
                    />
                </FormField>
                <FormField label="Copyright">
                    <MarkdownEditor
                        data={qMetadata.copyright || ''}
                        onChange={(copyright: string) => updateMeta(IQuestionnaireMetadataType.copyright, copyright)}
                    />
                </FormField>
            </Accordion>
        </div>
    );
};

export default MetadataEditor;
