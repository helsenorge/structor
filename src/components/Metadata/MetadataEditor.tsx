import './MetadataEditor.css';

import React, { useContext, useState } from 'react';
import { formatISO, parseISO } from 'date-fns';
import {
    authenticationRequirement,
    canBePerformedBy,
    isValidId,
    isValidTechnicalName,
    metadataOperators,
    presentationButtons,
} from '../../helpers/MetadataHelper';
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
import SwitchBtn from '../SwitchBtn/SwitchBtn';

const MetadataEditor = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;
    const [displayIdValidationError, setDisplayIdValidationError] = useState(false);
    const [displayNameValidationError, setDisplayNameValidationError] = useState(false);

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta | Extension[]) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const updateMetaExtension = (extension: Extension) => {
        if (qMetadata?.extension && qMetadata?.extension?.length > 0) {
            const newExtension = [...qMetadata.extension.filter((x) => x.url !== extension.url), extension];
            updateMeta(IQuestionnaireMetadataType.extension, newExtension);
        } else {
            updateMeta(IQuestionnaireMetadataType.extension, [extension]);
        }
    };

    const removeMetaExtension = (extensionUrl: string) => {
        const extensions = qMetadata.extension ? qMetadata.extension.filter((x) => x.url !== extensionUrl) : [];
        updateMeta(IQuestionnaireMetadataType.extension, extensions);
    };

    return (
        <div id="metadata-editor">
            <Accordion title="Skjemadetaljer">
                <FormField label="Description">
                    <textarea
                        placeholder="Beskrivelse av skjema"
                        defaultValue={qMetadata.description || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.description, e.target.value)}
                    />
                </FormField>

                <FormField label="Id">
                    <input
                        defaultValue={qMetadata.id}
                        onChange={(e) => {
                            setDisplayIdValidationError(!isValidId(e.target.value));
                        }}
                        onBlur={(e) => {
                            if (isValidId(e.target.value)) {
                                updateMeta(IQuestionnaireMetadataType.id, e.target.value);
                            }
                        }}
                    />
                    {displayIdValidationError && (
                        <div className="msg-error" aria-live="polite">
                            Id må være fra 1-64 tegn og kan kun inneholde bokstaver fra a-z, tall, - og .
                        </div>
                    )}
                </FormField>
                <FormField label="Teknisk navn">
                    <input
                        defaultValue={qMetadata.name}
                        onChange={(e) => {
                            setDisplayNameValidationError(!isValidTechnicalName(e.target.value, state.qMetadata.name));
                        }}
                        onBlur={(e) => {
                            if (isValidTechnicalName(e.target.value, qMetadata.name)) {
                                updateMeta(IQuestionnaireMetadataType.name, e.target.value);
                            }
                        }}
                    />
                    {displayNameValidationError && (
                        <div className="msg-error" aria-live="polite">
                            Teknisk navn må ha stor forbokstav, fra 1-255 tegn og kan kun inneholde tall, _ og bokstaver
                            fra a-z
                        </div>
                    )}
                </FormField>
                <FormField label="Versjon">
                    <input
                        placeholder="Versjonsnummer"
                        defaultValue={qMetadata.version}
                        onBlur={(e) => {
                            updateMeta(IQuestionnaireMetadataType.version, e.target.value);
                        }}
                    />
                </FormField>
                <FormField label="Helsenorge endpoint">
                    <input
                        placeholder="F.eks Endpoint/35"
                        defaultValue={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.endpoint)?.valueReference
                                ?.reference ?? ''
                        }
                        onBlur={(e) => {
                            if (!e.target.value) {
                                removeMetaExtension(IExtentionType.endpoint);
                            } else {
                                updateMetaExtension({
                                    url: IExtentionType.endpoint,
                                    valueReference: {
                                        reference: e.target.value,
                                    },
                                });
                            }
                        }}
                    />
                </FormField>
                <FormField label="Visning av knapperad">
                    <Select
                        value={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.presentationbuttons)
                                ?.valueCoding?.code ?? ''
                        }
                        onChange={(e) => {
                            if (e.target.value) {
                                updateMetaExtension({
                                    url: IExtentionType.presentationbuttons,
                                    valueCoding: {
                                        system: IExtentionType.presentationbuttonsValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.presentationbuttons);
                            }
                        }}
                        options={[{ code: '', display: 'Ikke valgt (standard oppførsel)' }, ...presentationButtons]}
                    />
                </FormField>
                <FormField label="Beskriver om innlogging kreves for å besvare skjemaet">
                    <Select
                        value={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.authenticationRequirement)
                                ?.valueCoding?.code ?? ''
                        }
                        onChange={(e) => {
                            if (e.target.value) {
                                updateMetaExtension({
                                    url: IExtentionType.authenticationRequirement,
                                    valueCoding: {
                                        system: IExtentionType.authenticationRequirementValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.authenticationRequirement);
                            }
                        }}
                        options={[
                            { code: '', display: 'Ikke valgt (standard oppførsel)' },
                            ...authenticationRequirement,
                        ]}
                    />
                </FormField>
                <FormField label="Beskriver om andre enn pasienten kan besvare skjemaet">
                    <Select
                        value={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.canBePerformedBy)?.valueCoding
                                ?.code ?? ''
                        }
                        onChange={(e) => {
                            if (e.target.value) {
                                updateMetaExtension({
                                    url: IExtentionType.canBePerformedBy,
                                    valueCoding: {
                                        system: IExtentionType.canBePerformedByValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.canBePerformedBy);
                            }
                        }}
                        options={[{ code: '', display: 'Ikke valgt (standard oppførsel)' }, ...canBePerformedBy]}
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
                        defaultValue={qMetadata.publisher || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.publisher, e.target.value)}
                    />
                </FormField>
                <FormField label="Formål">
                    <MarkdownEditor
                        data={qMetadata.purpose || ''}
                        onBlur={(purpose: string) => updateMeta(IQuestionnaireMetadataType.purpose, purpose)}
                    />
                </FormField>
                <FormField label="Copyright">
                    <MarkdownEditor
                        data={qMetadata.copyright || ''}
                        onBlur={(copyright: string) => updateMeta(IQuestionnaireMetadataType.copyright, copyright)}
                    />
                </FormField>
                <FormField label="Generer PDF ved besvarelse">
                    <SwitchBtn
                        onChange={() =>
                            updateMetaExtension({
                                url: IExtentionType.generatePDF,
                                valueBoolean: !qMetadata?.extension?.find((ex) => ex.url === IExtentionType.generatePDF)
                                    ?.valueBoolean,
                            })
                        }
                        value={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.generatePDF)?.valueBoolean ||
                            false
                        }
                        label=""
                        initial
                    />
                </FormField>
                <FormField label="Bruk navigator">
                    <SwitchBtn
                        onChange={() => {
                            const hasNavigatorExtension = !!qMetadata?.extension?.find(
                                (ex) => ex.url === IExtentionType.navigator,
                            );
                            if (hasNavigatorExtension) {
                                // remove extension
                                removeMetaExtension(IExtentionType.navigator);
                            } else {
                                // set extension
                                updateMetaExtension({
                                    url: IExtentionType.navigator,
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                system: IExtentionType.navigatorCodeSystem,
                                                code: 'navigator',
                                            },
                                        ],
                                    },
                                });
                            }
                        }}
                        value={!!qMetadata?.extension?.find((ex) => ex.url === IExtentionType.navigator) || false}
                        label=""
                        initial
                    />
                </FormField>
            </Accordion>
        </div>
    );
};

export default MetadataEditor;
