import React, { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { validateElements } from "src/components/Validation/ElementValidation/elementValidation";
import { validateQuestionnaireDetails } from "src/components/Validation/QuestionnaireDetailsValidation/questionnaireDetailsValidation";
import {
  validateTranslations,
  warnMarkdownInTranslations,
} from "src/components/Validation/TranslationValidation/translationValidation";
import { ValidationErrorsModal } from "src/components/Validation/validationErrorsModal";
import { useValidationContext } from "src/contexts/validation/useValidationContext";
import {
  getAllQuestionnaires,
  getQuestionnaire,
} from "src/store/treeStore/indexedDbHelper";
import { getInitialState } from "src/store/treeStore/initialState";
import { resetQuestionnaireAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import TranslationModal from "../../components/Languages/Translation/TranslationModal";
import Navbar from "../../components/Navbar/Navbar";
import FormFillerPreview from "../../components/Refero/FormFillerPreview";
import { ValidationError } from "../../utils/validationUtils";
const PageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const {
    setTranslateLang,
    translateLang,
    itemsErrors,
    setItemsErrors,
    questionnaireDetailsErrors,
    setQuestionnaireDetailsErrors,
  } = useValidationContext();
  const { state, dispatch } = useContext(TreeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [markdownWarning, setMarkdownWarning] = useState<
    ValidationError | undefined
  >(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [showValidationModal, setShowValidationModal] =
    useState<boolean>(false);
  const onClickValidation = (): void => {
    setItemsErrors(validateElements(t, state));
    setTranslationErrors(validateTranslations(t, state));
    setQuestionnaireDetailsErrors(validateQuestionnaireDetails(t, state));
    setMarkdownWarning(warnMarkdownInTranslations(t, state));
    setShowValidationModal(true);
  };
  const [translationErrors, setTranslationErrors] = useState<
    Array<ValidationError>
  >([]);
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      let targetState = id
        ? await getQuestionnaire(id).then(
            (q) =>
              q ??
              getAllQuestionnaires().then((list) =>
                list.find((x) => x.qMetadata.id === id),
              ),
          )
        : null;

      if (!targetState) {
        targetState = getInitialState();
      }
      const realId = targetState.qMetadata.id!;
      if (id !== realId) {
        navigate(`/formbuilder/${realId}`, { replace: true });
      }
      dispatch(resetQuestionnaireAction(targetState));
    };

    initialize();
  }, [id, dispatch, navigate]);
  return (
    <>
      <Navbar
        onValidationClick={onClickValidation}
        showFormFiller={() => setShowPreview(!showPreview)}
        setCloseForm={() => {
          navigate("/");
        }}
      />
      {showPreview && (
        <FormFillerPreview
          showFormFiller={() => setShowPreview(!showPreview)}
          language={state.qMetadata.language}
          state={state}
        />
      )}
      {translateLang && (
        <TranslationModal
          markdownWarning={markdownWarning}
          close={() => setTranslateLang("")}
          targetLanguage={translateLang}
          validationErrors={translationErrors}
        />
      )}
      {showValidationModal && (
        <ValidationErrorsModal
          validationErrors={itemsErrors}
          translationErrors={translationErrors}
          questionnaireDetailsErrors={questionnaireDetailsErrors}
          markdownWarning={markdownWarning}
          qAdditionalLanguages={state.qAdditionalLanguages}
          onClose={() => setShowValidationModal(false)}
        />
      )}
      {children}
    </>
  );
};
export default PageWrapper;
