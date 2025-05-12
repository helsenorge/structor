import React from "react";

import { useTranslation } from "react-i18next";

import { useKeyPress } from "../../../hooks/useKeyPress";
import { ValidationError } from "../../../utils/validationUtils";
import LanguageAccordion from "../../Languages/LanguageAccordion";
import MetadataEditor from "../../Metadata/MetadataEditor";
import QuestionnaireSettings from "../../Metadata/QuestionnaireSettings";
import Sidebar from "../../Sidebar/Sidebar";
import Drawer from "../Drawer";

type FormDetailsDrawerProps = {
  setTranslateLang: (language: string) => void;
  closeDrawer: () => void;
  sidebarErrors: ValidationError[];
  isOpen?: boolean;
};

const FormDetailsDrawer = ({
  setTranslateLang,
  closeDrawer,
  sidebarErrors,
  isOpen = false,
}: FormDetailsDrawerProps): React.JSX.Element => {
  const { t } = useTranslation();

  useKeyPress("Escape", closeDrawer, !isOpen);

  return (
    <Drawer
      title={t("Questionnaire details")}
      position="left"
      visible={isOpen}
      hide={closeDrawer}
    >
      <MetadataEditor sidebarErrors={sidebarErrors} />
      <QuestionnaireSettings />
      <Sidebar sidebarErrors={sidebarErrors} />
      <LanguageAccordion setTranslateLang={setTranslateLang} />
    </Drawer>
  );
};

export default FormDetailsDrawer;
