import type { JSX } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import AdvancedQuestionnaireSettings from "src/components/AdvancedQuestionnaireSettings";
import QuestionnaireSettings from "src/components/QuestionnaireDetails/QuestionnaireSettings";

import type { ValidationError } from "../../../utils/validationUtils";
import type { ExtendedLanguageLocales } from "src/types/LanguageTypes";

import { useKeyPress } from "../../../hooks/useKeyPress";
import LanguageAccordion from "../../Languages/LanguageAccordion";
import MetadataEditor from "../../QuestionnaireDetails/MetadataEditor";
import Sidebar from "../../QuestionnaireDetails/Sidebar";
import Drawer from "../Drawer";

type FormDetailsDrawerProps = {
  setTranslateLang: (language: ExtendedLanguageLocales) => void;
  closeDrawer: () => void;
  questionnaireDetailsErrors: ValidationError[];
  isOpen?: boolean;
};

const FormDetailsDrawer = ({
  setTranslateLang,
  closeDrawer,
  questionnaireDetailsErrors,
  isOpen = false,
}: FormDetailsDrawerProps): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  useKeyPress("Escape", closeDrawer, !isOpen);

  return (
    <Drawer
      title={t("Questionnaire details")}
      position="left"
      visible={isOpen}
      hide={closeDrawer}
      key={id}
    >
      <MetadataEditor questionnaireDetailsErrors={questionnaireDetailsErrors} />
      <QuestionnaireSettings
        questionnaireDetailsErrors={questionnaireDetailsErrors}
      />
      <Sidebar questionnaireDetailsErrors={questionnaireDetailsErrors} />
      <LanguageAccordion setTranslateLang={setTranslateLang} />
      <AdvancedQuestionnaireSettings />
    </Drawer>
  );
};

export default FormDetailsDrawer;
