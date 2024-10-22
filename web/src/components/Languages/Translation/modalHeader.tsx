import React from "react";

import { IQuestionnaireMetadata } from "../../../types/IQuestionnaireMetadataType";

import { getLanguageFromCode } from "../../../helpers/LanguageHelper";

interface ModalHeaderProps {
  qMetadata: IQuestionnaireMetadata;
  targetLanguage: string;
}

const ModalHeader = (props: ModalHeaderProps): React.JSX.Element => {
  return (
    <div className="sticky-header">
      {props.qMetadata.language && (
        <div className="horizontal equal">
          <div>
            <label>
              {getLanguageFromCode(props.qMetadata.language)?.display}
            </label>
          </div>
          <div>
            <label>{getLanguageFromCode(props.targetLanguage)?.display}</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
