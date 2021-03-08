import React, { useState } from 'react';
import { MetadataProperty } from '../../../types/LanguageTypes';
import { IQuestionnaireMetadata } from '../../../types/IQuestionnaireMetadataType';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import FormField from '../../FormField/FormField';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateMetadataTranslationAction } from '../../../store/treeStore/treeActions';

type TranslateMetaDataRowProps = {
    dispatch: React.Dispatch<ActionType>;
    metadataProperty: MetadataProperty;
    qMetadata: IQuestionnaireMetadata;
    targetLanguage: string;
    translations: Languages;
};

const TranslateMetaDataRow = ({
    dispatch,
    metadataProperty,
    qMetadata,
    targetLanguage,
    translations,
}: TranslateMetaDataRowProps): JSX.Element => {
    const [unique, setUnique] = useState(true);
    const { propertyName, label, markdown, mustBeUnique } = metadataProperty;
    const baseValue = qMetadata[propertyName];
    const translatedMetadata = translations[targetLanguage].metaData;
    const translatedValue = translatedMetadata[propertyName];
    const displayErrorMessage: boolean = mustBeUnique && !unique;

    const dispatchPropertyUpdate = (text: string) => {
        if (!mustBeUnique || unique) {
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
                    data={translatedValue || ''}
                    onChange={(value) => {
                        dispatchPropertyUpdate(value);
                    }}
                    placeholder="Legg inn oversettelse.."
                />
            ) : (
                <textarea
                    defaultValue={translatedValue}
                    onBlur={(event) => {
                        dispatchPropertyUpdate(event.target.value);
                    }}
                    onChange={(event) => {
                        if (mustBeUnique) {
                            setUnique(isUnique(event.target.value));
                        }
                    }}
                    placeholder="Legg inn oversettelse.."
                />
            )}
        </>
    );

    const isUnique = (value: string): boolean => {
        const usedPropertyValues: string[] = [];
        const mainPropertyValue = String(qMetadata[propertyName]);
        if (mainPropertyValue) {
            usedPropertyValues.push(mainPropertyValue);
        }
        Object.entries(translations)
            .filter(([languageCode]) => languageCode !== targetLanguage)
            .forEach(([, translation]) => {
                usedPropertyValues.push(translation.metaData[propertyName]);
            });
        return !usedPropertyValues.some((usedValue) => usedValue === value);
    };

    return (
        <div key={`${targetLanguage}-${propertyName}`}>
            <div className="translation-group-header">{label}</div>
            <div className="translation-row">
                <FormField>{renderBaseValue()}</FormField>
                <FormField>
                    {renderTranslation()}
                    {displayErrorMessage && <div className="msg-error">Må være unik</div>}
                </FormField>
            </div>
        </div>
    );
};

export default TranslateMetaDataRow;
