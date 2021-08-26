import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MetadataProperty } from '../../../types/LanguageTypes';
import { ActionType, TreeState } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateMetadataTranslationAction } from '../../../store/treeStore/treeActions';

type TranslateMetaDataRowProps = {
    dispatch: React.Dispatch<ActionType>;
    metadataProperty: MetadataProperty;
    state: TreeState;
    targetLanguage: string;
};

const TranslateMetaDataRow = ({
    dispatch,
    metadataProperty,
    state,
    targetLanguage,
}: TranslateMetaDataRowProps): JSX.Element => {
    const { t } = useTranslation();
    const { propertyName, label, markdown, validate } = metadataProperty;
    const baseValue = state.qMetadata[propertyName];
    const translatedMetadata =
        state.qAdditionalLanguages && state.qAdditionalLanguages[targetLanguage]
            ? state.qAdditionalLanguages[targetLanguage].metaData
            : {};
    const [translatedValue, setTranslatedValue] = useState(translatedMetadata[propertyName]);
    const validationMessage = validate ? t(validate(translatedValue, state, targetLanguage)) : '';

    const dispatchPropertyUpdate = (text: string) => {
        if (!validationMessage) {
            dispatch(updateMetadataTranslationAction(targetLanguage, propertyName, text));
        }
    };

    const renderBaseValue = () => (
        <>
            {markdown && <MarkdownEditor data={baseValue || ''} disabled={true} />}
            {!markdown && <textarea defaultValue={baseValue} disabled={true} />}
        </>
    );

    const renderTranslation = () => (
        <>
            {markdown ? (
                <MarkdownEditor
                    data={translatedValue}
                    onBlur={(value) => {
                        dispatchPropertyUpdate(value);
                    }}
                    placeholder={t('Enter translation..')}
                />
            ) : (
                <textarea
                    defaultValue={translatedValue}
                    onBlur={(event) => {
                        dispatchPropertyUpdate(event.target.value);
                    }}
                    onChange={(event) => {
                        setTranslatedValue(event.target.value);
                    }}
                    placeholder={t('Enter translation..')}
                />
            )}
        </>
    );

    return (
        <div key={`${targetLanguage}-${propertyName}`}>
            <div className="translation-group-header">{t(label)}</div>
            <div className="translation-row">
                <FormField>{renderBaseValue()}</FormField>
                <FormField>
                    {renderTranslation()}
                    {validationMessage && (
                        <div className="msg-error" aria-live="polite">
                            {validationMessage}
                        </div>
                    )}
                </FormField>
            </div>
        </div>
    );
};

export default TranslateMetaDataRow;
