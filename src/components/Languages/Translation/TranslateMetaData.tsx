import React from 'react';
import { translatableMetadata } from '../../../helpers/LanguageHelper';
import FormField from '../../FormField/FormField';
import { IQuestionnaireMetadata } from '../../../types/IQuestionnaireMetadataType';
import { ActionType, Languages, Translation } from '../../../store/treeStore/treeStore';
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
            {translatableMetadata.map((prop) => {
                const { propertyName, label, markdown } = prop;
                const baseValue = qMetadata[propertyName];
                const translatedValue = translations[targetLanguage].metaData[propertyName];
                return (
                    <div key={propertyName}>
                        <div>{label}</div>
                        <div className="translation-row">
                            <FormField>
                                {markdown ? (
                                    <MarkdownEditor data={baseValue || ''} disabled={true} />
                                ) : (
                                    <input defaultValue={baseValue} disabled={true} />
                                )}
                            </FormField>
                            <FormField>
                                {markdown ? (
                                    <MarkdownEditor
                                        data={translatedValue || ''}
                                        onChange={(text) => {
                                            dispatchPropertyUpdate(propertyName, text);
                                        }}
                                    />
                                ) : (
                                    <input
                                        defaultValue={translatedValue}
                                        onBlur={(event) => {
                                            dispatchPropertyUpdate(propertyName, event.target.value);
                                        }}
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
