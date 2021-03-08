import React from 'react';
import { translatableMetadata } from '../../../helpers/LanguageHelper';
import { IQuestionnaireMetadata } from '../../../types/IQuestionnaireMetadataType';
import { ActionType, Languages } from '../../../store/treeStore/treeStore';
import TranslateMetaDataRow from './TranslateMetaDataRow';

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
    return (
        <div className="translation-group">
            <div className="translation-section-header">Skjemadetaljer</div>
            {translatableMetadata.map((prop) => (
                <TranslateMetaDataRow
                    dispatch={dispatch}
                    key={prop.propertyName}
                    metadataProperty={prop}
                    qMetadata={qMetadata}
                    targetLanguage={targetLanguage}
                    translations={translations}
                />
            ))}
        </div>
    );
};

export default TranslateMetaData;
