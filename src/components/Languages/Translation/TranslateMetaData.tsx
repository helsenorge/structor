import React from 'react';
import { translatableMetadata } from '../../../helpers/LanguageHelper';
import FormField from '../../FormField/FormField';
import { IQuestionnaireMetadata } from '../../../types/IQuestionnaireMetadataType';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import MarkdownEditor from '../../MarkdownEditor/MarkdownEditor';
import { updateMetadataTranslationAction } from '../../../store/treeStore/treeActions';

type TranslateMetaDataProps = {
    qMetadata: IQuestionnaireMetadata;
    targetLanguage: string;
    translations: Languages;
    dispatch: React.Dispatch<ActionType>;
};

const TranslateMetaData = ({
    qMetadata,
    translations,
    targetLanguage,
    dispatch,
}: TranslateMetaDataProps): JSX.Element => {
    const dispatchPropertyUpdate = (propertyName: string, text: string) => {
        dispatch(updateMetadataTranslationAction(targetLanguage, propertyName, text));
    };
    return (
        <div className="translation-group">
            <div className="translation-section-header">Skjemadetaljer</div>
            {translatableMetadata.map((prop) => {
                const { propertyName, label, markdown } = prop;
                const baseValue = qMetadata[propertyName];
                const translatedValue = translations[targetLanguage].metaData[propertyName];
                return (
                    <div key={`${targetLanguage}-${propertyName}`}>
                        <div className="translation-group-header">{label}</div>
                        <div className="translation-row">
                            <FormField>
                                {markdown ? (
                                    <MarkdownEditor data={baseValue || ''} disabled={true} />
                                ) : (
                                    <textarea defaultValue={baseValue} disabled={true} />
                                )}
                            </FormField>
                            <FormField>
                                {markdown ? (
                                    <MarkdownEditor
                                        data={translatedValue || ''}
                                        onChange={(text) => {
                                            dispatchPropertyUpdate(propertyName, text);
                                        }}
                                        placeholder="Legg inn oversettelse.."
                                    />
                                ) : (
                                    <textarea
                                        defaultValue={translatedValue}
                                        onBlur={(event) => {
                                            dispatchPropertyUpdate(propertyName, event.target.value);
                                        }}
                                        placeholder="Legg inn oversettelse.."
                                    />
                                )}
                            </FormField>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TranslateMetaData;
