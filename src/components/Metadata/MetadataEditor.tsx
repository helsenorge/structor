import './MetadataEditor.css';

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatISO, parseISO } from 'date-fns';
import {
    authenticationRequirement,
    canBePerformedBy,
    isValidId,
    isValidTechnicalName,
    metadataOperators,
    presentationButtons,
    saveCapability,
    useContextSystem,
} from '../../helpers/MetadataHelper';
import Accordion from '../Accordion/Accordion';
import DateTimePicker from '../DatePicker/DateTimePicker';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { ContactDetail, Extension, Meta, UsageContext } from '../../types/fhir';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { IExtentionType, IValueSetSystem } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import { removeQuestionnaireExtension, setQuestionnaireExtension } from '../../helpers/extensionHelper';

const MetadataEditor = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;
    const [displayIdValidationError, setDisplayIdValidationError] = useState(false);
    const [displayNameValidationError, setDisplayNameValidationError] = useState(false);

    const updateMeta = (
        propName: IQuestionnaireMetadataType,
        value: string | Meta | Extension[] | ContactDetail[] | UsageContext[],
    ) => {
        dispatch(updateQuestionnaireMetadataAction(propName, value));
    };

    const updateMetaExtension = (extension: Extension) => {
        setQuestionnaireExtension(qMetadata, extension, dispatch);
    };

    const removeMetaExtension = (extensionUrl: string) => {
        removeQuestionnaireExtension(qMetadata, extensionUrl, dispatch);
    };

    const getGeneratePdfValue = (): boolean => {
        const extension = qMetadata?.extension?.find((ex) => ex.url === IExtentionType.generatePDF);
        return extension ? extension.valueBoolean || false : true;
    };

    const getSaveCapability = (): string => {
        const saveCapabilityValue = qMetadata?.extension?.find((x) => x.url === IExtentionType.saveCapability);
        return saveCapabilityValue?.valueCoding?.code || '';
    };

    const getUseContextSystem = (): string => {
        const system =
            qMetadata.useContext &&
            qMetadata.useContext.length > 0 &&
            qMetadata.useContext[0].valueCodeableConcept?.coding &&
            qMetadata.useContext[0].valueCodeableConcept.coding.length > 0 &&
            qMetadata.useContext[0].valueCodeableConcept.coding[0].system;

        return system || '';
    };

    return (
        <div id="metadata-editor">
            <Accordion title={t('Questionnaire details')}>
                <FormField label={t('Description')}>
                    <textarea
                        placeholder={t('Description of questionnaire')}
                        defaultValue={qMetadata.description || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.description, e.target.value)}
                    />
                </FormField>

                <FormField label={t('Id')}>
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
                            {t('Id must be 1-64 characters and only letters a-z, numbers, - and .')}
                        </div>
                    )}
                </FormField>
                <FormField label={t('Teknisk navn')}>
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
                            {t(
                                'Technical name must start with a captital letter, 1-255 characters and can only contain numbers and characters a-z',
                            )}
                        </div>
                    )}
                </FormField>
                <FormField label={t('Versjon')}>
                    <input
                        placeholder={t('Version number')}
                        defaultValue={qMetadata.version}
                        onBlur={(e) => {
                            updateMeta(IQuestionnaireMetadataType.version, e.target.value);
                        }}
                    />
                </FormField>
                <FormField label={t('Helsenorge endpoint')}>
                    <input
                        placeholder={t('For example Endpoint/35')}
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
                <FormField label={t('Button bar display')}>
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
                                        system: IValueSetSystem.presentationbuttonsValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.presentationbuttons);
                            }
                        }}
                        options={presentationButtons}
                    />
                </FormField>
                <FormField label={t('Describes if user must be logged in to answer questionnaire')}>
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
                                        system: IValueSetSystem.authenticationRequirementValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.authenticationRequirement);
                            }
                        }}
                        options={authenticationRequirement}
                    />
                </FormField>
                <FormField label={t('Describes if representative can answer questionnaire')}>
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
                                        system: IValueSetSystem.canBePerformedByValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.canBePerformedBy);
                            }
                        }}
                        options={canBePerformedBy}
                    />
                </FormField>
                <FormField label={t('Save capabilities')}>
                    <Select
                        value={getSaveCapability()}
                        onChange={(e) => {
                            if (e.target.value) {
                                updateMetaExtension({
                                    url: IExtentionType.saveCapability,
                                    valueCoding: {
                                        system: IValueSetSystem.saveCapabilityValueSet,
                                        code: e.target.value,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.saveCapability);
                            }
                        }}
                        options={saveCapability}
                    />
                </FormField>
                <FormField label={t('Access control')}>
                    <Select
                        value={getUseContextSystem()}
                        onChange={(e) => {
                            const updateValue = [
                                {
                                    code: {
                                        system: 'http://hl7.org/fhir/ValueSet/usage-context-type',
                                        code: 'focus',
                                        display: 'Clinical Focus',
                                    },
                                    valueCodeableConcept: {
                                        coding: [
                                            {
                                                system: e.target.value,
                                            },
                                        ],
                                    },
                                },
                            ];
                            updateMeta(IQuestionnaireMetadataType.useContext, updateValue);
                        }}
                        options={useContextSystem}
                    />
                </FormField>
                <FormField label={t('Date')}>
                    <DateTimePicker
                        selected={qMetadata.date ? parseISO(qMetadata.date) : undefined}
                        disabled={false}
                        nowButton={true}
                        callback={(date: Date) => {
                            updateMeta(IQuestionnaireMetadataType.date, formatISO(date));
                        }}
                    />
                </FormField>

                <FormField label={t('Status')}>
                    <Select
                        value={qMetadata.status || ''}
                        options={metadataOperators}
                        onChange={(e) => updateMeta(IQuestionnaireMetadataType.status, e.target.value)}
                    ></Select>
                </FormField>
                <FormField label={t('Publisher')}>
                    <input
                        defaultValue={qMetadata.publisher || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.publisher, e.target.value)}
                    />
                </FormField>
                <FormField label={t('Contact (URL to contact adress)')}>
                    <input
                        defaultValue={
                            qMetadata.contact && qMetadata.contact.length > 0 ? qMetadata.contact[0].name : ''
                        }
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.contact, [{ name: e.target.value }])}
                    />
                </FormField>
                <FormField label={t('Url')}>
                    <input
                        defaultValue={state.qMetadata.url || ''}
                        placeholder={t('Enter a url..')}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.url, e.target.value || '')}
                        pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                    />
                </FormField>
                <FormField label={t('Purpose')}>
                    <MarkdownEditor
                        data={qMetadata.purpose || ''}
                        onBlur={(purpose: string) => updateMeta(IQuestionnaireMetadataType.purpose, purpose)}
                    />
                </FormField>
                <FormField label={t('Copyright')}>
                    <MarkdownEditor
                        data={qMetadata.copyright || ''}
                        onBlur={(copyright: string) => updateMeta(IQuestionnaireMetadataType.copyright, copyright)}
                    />
                </FormField>
                <FormField label={t('Generate PDF on submit')}>
                    <SwitchBtn
                        onChange={() =>
                            updateMetaExtension({
                                url: IExtentionType.generatePDF,
                                valueBoolean: !getGeneratePdfValue(),
                            })
                        }
                        value={getGeneratePdfValue()}
                        label=""
                        initial
                    />
                </FormField>
                <FormField label={t('Use navigator')}>
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
