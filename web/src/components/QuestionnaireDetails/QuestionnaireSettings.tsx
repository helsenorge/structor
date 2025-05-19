import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { ValidationError } from "src/utils/validationUtils";

import AuthenticationRequirementView from "./QuestionnaireSettings/AuthenticationRequirementView";
import ButtonsPresentationView from "./QuestionnaireSettings/ButtonsPresentationView";
import EndpointView from "./QuestionnaireSettings/EndpointView";
import MetaItemExtractionContextView from "./QuestionnaireSettings/MetaItemExtractionView";
import MetaSecurityEditor from "./QuestionnaireSettings/MetaSecurityEditor";
import NavigationView from "./QuestionnaireSettings/NavigationView";
import PdfSectionView from "./QuestionnaireSettings/PdfSectionView";
import PrintVersionView from "./QuestionnaireSettings/PrintVersionView";
import ProgressIndicatorView from "./QuestionnaireSettings/ProgressIndicatorView";
import SaveCapabilityView from "./QuestionnaireSettings/SaveCapabilityView";
import {
  removeQuestionnaireExtension,
  setQuestionnaireExtension,
} from "../../helpers/extensionHelper";
import { TreeContext } from "../../store/treeStore/treeStore";
import Accordion from "../Accordion/Accordion";
import WorkflowView from "./QuestionnaireSettings/WorkflowView";

interface QuestionnaireSettingsProps {
  questionnaireDetailsErrors: ValidationError[];
}

const QuestionnaireSettings = (
  props: QuestionnaireSettingsProps,
): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { qMetadata } = state;

  const updateMetaExtension = (extension: Extension): void => {
    setQuestionnaireExtension(qMetadata, extension, dispatch);
  };

  const removeMetaExtension = (extensionUrl: string): void => {
    removeQuestionnaireExtension(qMetadata, extensionUrl, dispatch);
  };

  return (
    <Accordion title={t("Questionnaire settings")}>
      <EndpointView
        errors={props.questionnaireDetailsErrors}
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <PrintVersionView
        errors={props.questionnaireDetailsErrors}
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <MetaSecurityEditor />
      <ButtonsPresentationView
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <AuthenticationRequirementView
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <MetaItemExtractionContextView />
      <SaveCapabilityView
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <PdfSectionView updateExtension={updateMetaExtension} />
      <ProgressIndicatorView />
      <NavigationView
        removeExtension={removeMetaExtension}
        updateExtension={updateMetaExtension}
      />
      <WorkflowView />
    </Accordion>
  );
};

export default QuestionnaireSettings;
