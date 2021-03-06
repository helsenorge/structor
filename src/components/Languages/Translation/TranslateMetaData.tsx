import React from 'react';
import { translatableMetadata } from '../../../helpers/LanguageHelper';
import { ActionType, TreeState } from '../../../store/treeStore/treeStore';
import TranslateMetaDataRow from './TranslateMetaDataRow';

type TranslateMetaDataProps = {
    state: TreeState;
    targetLanguage: string;
    dispatch: React.Dispatch<ActionType>;
};

const TranslateMetaData = ({ state, targetLanguage, dispatch }: TranslateMetaDataProps): JSX.Element => {
    return (
        <div className="translation-group">
            <div className="translation-section-header">Skjemadetaljer</div>
            {translatableMetadata.map((prop) => (
                <TranslateMetaDataRow
                    dispatch={dispatch}
                    key={prop.propertyName}
                    metadataProperty={prop}
                    state={state}
                    targetLanguage={targetLanguage}
                />
            ))}
        </div>
    );
};

export default TranslateMetaData;
