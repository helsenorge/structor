import './MetadataEditor.css';

import React, { useContext } from 'react';
import { metadataLanguage, metadataOperators } from '../../helpers/MetadataHelper';

import Accordion from '../Accordion/Accordion';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { Meta } from '../../types/fhir';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';

const MetadataEditor = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    return (
        <div id="metadata-editor">
            <Accordion title="Skjemadetaljer">
                <FormField label="Description">
                    <textarea
                        placeholder="Beskrivelse av skjema"
                        value={qMetadata.description || ''}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.description, e.target.value)}
                    />
                </FormField>

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
                        onChange={(e) => {
                            const display = metadataLanguage.find((x) => x.code === e.target.value)?.localDisplay;
                            const newMeta = {
                                ...qMetadata.meta,
                                tag: qMetadata.meta?.tag?.map((x) =>
                                    x.system === 'urn:ietf:bcp:47'
                                        ? {
                                              system: 'urn:ietf:bcp:47',
                                              code: e.target.value,
                                              display: display,
                                          }
                                        : x,
                                ),
                            };
                            updateMeta(IQuestionnaireMetadataType.language, e.target.value);
                            updateMeta(IQuestionnaireMetadataType.meta, newMeta);
                        }}
                    ></Select>
                </FormField>
                <FormField label="Teknisk navn">
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
