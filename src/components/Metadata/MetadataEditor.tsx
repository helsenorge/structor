import './MetadataEditor.css';

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatISO, parseISO } from 'date-fns';
import {
    authenticationRequirement,
    canBePerformedBy,
    isValidId,
    isValidTechnicalName,
    questionnaireStatusOptions,
    presentationButtons,
    saveCapability,
} from '../../helpers/MetadataHelper';
import Accordion from '../Accordion/Accordion';
import DateTimePicker from '../DatePicker/DateTimePicker';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { ContactDetail, Extension, Meta } from '../../types/fhir';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import { IExtentionType, IValueSetSystem } from '../../types/IQuestionnareItemType';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import { removeQuestionnaireExtension, setQuestionnaireExtension } from '../../helpers/extensionHelper';
import RadioBtn from '../RadioBtn/RadioBtn';
import InputField from '../InputField/inputField';

const MetadataEditor = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const { qMetadata } = state;
    const [displayIdValidationError, setDisplayIdValidationError] = useState(false);
    const [displayNameValidationError, setDisplayNameValidationError] = useState(false);

    const updateMeta = (propName: IQuestionnaireMetadataType, value: string | Meta | Extension[] | ContactDetail[]) => {
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

    return (
        <div id="metadata-editor">
            <Accordion title={t('Questionnaire details')}>
                <FormField label={t('Description')} isOptional>
                    <textarea
                        placeholder={t('Description of questionnaire')}
                        defaultValue={qMetadata.description || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.description, e.target.value)}
                    />
                </FormField>

                <FormField label={t('Id')}>
                    <InputField
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
                    <InputField
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
                    <InputField
                        placeholder={t('Version number')}
                        defaultValue={qMetadata.version}
                        onBlur={(e) => {
                            updateMeta(IQuestionnaireMetadataType.version, e.target.value);
                        }}
                    />
                </FormField>
                <FormField label={t('Helsenorge endpoint')}>
                    <InputField
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
                    <RadioBtn
                        onChange={(newValue: string) => {
                            if (newValue) {
                                updateMetaExtension({
                                    url: IExtentionType.presentationbuttons,
                                    valueCoding: {
                                        system: IValueSetSystem.presentationbuttonsValueSet,
                                        code: newValue,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.presentationbuttons);
                            }
                        }}
                        checked={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.presentationbuttons)
                                ?.valueCoding?.code ?? 'sticky'
                        }
                        options={presentationButtons}
                        name={'presentationbuttons-radio'}
                    />
                </FormField>
                <FormField label={t('Describes if user must be logged in to answer questionnaire')}>
                    <RadioBtn
                        onChange={(newValue: string) => {
                            if (newValue) {
                                updateMetaExtension({
                                    url: IExtentionType.authenticationRequirement,
                                    valueCoding: {
                                        system: IValueSetSystem.authenticationRequirementValueSet,
                                        code: newValue,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.authenticationRequirement);
                            }
                        }}
                        checked={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.authenticationRequirement)
                                ?.valueCoding?.code ?? '3'
                        }
                        options={authenticationRequirement}
                        name={'authenticationRequirement-radio'}
                    />
                </FormField>
                <FormField label={t('Describes if representative can answer questionnaire')}>
                    <RadioBtn
                        onChange={(newValue: string) => {
                            if (newValue) {
                                updateMetaExtension({
                                    url: IExtentionType.canBePerformedBy,
                                    valueCoding: {
                                        system: IValueSetSystem.canBePerformedByValueSet,
                                        code: newValue,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.canBePerformedBy);
                            }
                        }}
                        checked={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.canBePerformedBy)?.valueCoding
                                ?.code ?? '1'
                        }
                        options={canBePerformedBy}
                        name={'canBePerformedBy-radio'}
                    />
                </FormField>
                <FormField label={t('Save capabilities')}>
                    <RadioBtn
                        onChange={(newValue: string) => {
                            if (newValue) {
                                updateMetaExtension({
                                    url: IExtentionType.saveCapability,
                                    valueCoding: {
                                        system: IValueSetSystem.saveCapabilityValueSet,
                                        code: newValue,
                                    },
                                });
                            } else {
                                removeMetaExtension(IExtentionType.saveCapability);
                            }
                        }}
                        checked={
                            qMetadata?.extension?.find((ex) => ex.url === IExtentionType.saveCapability)?.valueCoding
                                ?.code ?? '1'
                        }
                        options={saveCapability}
                        name={'saveCapability-radio'}
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
                    <RadioBtn
                        onChange={(newValue: string) => updateMeta(IQuestionnaireMetadataType.status, newValue)}
                        checked={qMetadata.status || ''}
                        options={questionnaireStatusOptions}
                        name={'status-radio'}
                    />
                </FormField>
                <FormField label={t('Publisher')}>
                    <InputField
                        defaultValue={qMetadata.publisher || ''}
                        onBlur={(e) => updateMeta(IQuestionnaireMetadataType.publisher, e.target.value)}
                    />
                </FormField>
                <FormField label={t('Contact (URL to contact adress)')}>
                    <InputField
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
