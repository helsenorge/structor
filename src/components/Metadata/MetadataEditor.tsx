import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatISO, parseISO } from 'date-fns';
import { isValidId, isValidTechnicalName, questionnaireStatusOptions } from '../../helpers/MetadataHelper';
import Accordion from '../Accordion/Accordion';
import DatePicker from '../DatePicker/DatePicker';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import { ContactDetail, Extension, Meta, UsageContext } from '../../types/fhir';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import RadioBtn from '../RadioBtn/RadioBtn';
import InputField from '../InputField/inputField';

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

    return (
        <div id="metadata-editor">
            <Accordion title={t('Questionnaire details')}>
                <FormField label={`${t('Title')}:`}>
                    <input
                        placeholder={t('Title')}
                        value={state.qMetadata.title}
                        onChange={(event) => {
                            updateMeta(IQuestionnaireMetadataType.title, event.target.value);
                        }}
                    />
                </FormField>
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
                <FormField label={t('Technical name')}>
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
                <FormField label={t('Version')}>
                    <InputField
                        placeholder={t('Version number')}
                        defaultValue={qMetadata.version}
                        onBlur={(e) => {
                            updateMeta(IQuestionnaireMetadataType.version, e.target.value);
                        }}
                    />
                </FormField>

                <FormField label={t('Date')}>
                    <DatePicker
                        type="date"
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
                <FormField label={t('Contact (URL to contact address)')}>
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
            </Accordion>
        </div>
    );
};

export default MetadataEditor;
