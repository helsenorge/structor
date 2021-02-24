import './MetadataEditor.css';

import React, { useContext } from 'react';
import { formatISO, parseISO } from 'date-fns';
import { metadataLanguage, metadataOperators } from '../../helpers/MetadataHelper';

import Accordion from '../Accordion/Accordion';
import DateTimePicker from '../DatePicker/DateTimePicker';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { Extension, Meta } from '../../types/fhir';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { IExtentionType } from '../../types/IQuestionnareItemType';

const MetadataEditor = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta | Extension[]) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const updateMetaExtension = (value: string) => {
        const extension = [
            {
                url: IExtentionType.endpoint,
                valueReference: {
                    reference: value,
                },
            } as Extension,
        ];
        updateMeta(IQuestionnaireMetadataType.extension, extension);
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
                <FormField label="Helsenorge endpoint">
                    <input
                        placeholder="F.eks Endpoint/35"
                        defaultValue={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.endpoint)?.valueReference
                                ?.reference ?? ''
                        }
                        onBlur={(e) => updateMetaExtension(e.target.value)}
                    />
                </FormField>
                <FormField label="Dato">
                    <DateTimePicker
                        selected={qMetadata.date ? parseISO(qMetadata.date) : undefined}
                        disabled={false}
                        nowButton={true}
                        callback={(date: Date) => {
                            updateMeta(IQuestionnaireMetadataType.date, formatISO(date));
                        }}
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
