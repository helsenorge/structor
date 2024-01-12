import React from 'react';
import { getLanguageFromCode } from '../../../helpers/LanguageHelper';
import { IQuestionnaireMetadata } from '../../../types/IQuestionnaireMetadataType';

interface ModalHeaderProps {
    qMetadata: IQuestionnaireMetadata;
    targetLanguage: string;
};

const ModalHeader = (props: ModalHeaderProps): React.React.JSX.Element => {
    return ( <div className="sticky-header">
    {props.qMetadata.language && (
        <div className="horizontal equal">
            <div>
                <label>{getLanguageFromCode(props.qMetadata.language)?.display}</label>
            </div>
            <div>
                <label>{getLanguageFromCode(props.targetLanguage)?.display}</label>
            </div>
        </div>
    )}
</div>);
}

export default ModalHeader;