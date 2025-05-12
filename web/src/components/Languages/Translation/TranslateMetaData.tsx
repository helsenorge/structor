import React from "react";

import { useTranslation } from "react-i18next";
import { ValidationError } from "src/utils/validationUtils";

import TranslateMetaDataRow from "./TranslateMetaDataRow";
import { translatableMetadata } from "../../../helpers/LanguageHelper";
import { ActionType, TreeState } from "../../../store/treeStore/treeStore";

type TranslateMetaDataProps = {
  state: TreeState;
  targetLanguage: string;
  validationErrors: ValidationError[];
  dispatch: React.Dispatch<ActionType>;
};

const TranslateMetaData = ({
  state,
  targetLanguage,
  validationErrors,
  dispatch,
}: TranslateMetaDataProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="translation-group">
      <div className="translation-section-header">
        {t("Questionnaire details")}
      </div>
      {translatableMetadata.map((prop) => (
        <TranslateMetaDataRow
          dispatch={dispatch}
          key={prop.propertyName}
          metadataProperty={prop}
          state={state}
          targetLanguage={targetLanguage}
          validationErrors={validationErrors}
        />
      ))}
    </div>
  );
};

export default TranslateMetaData;
