import React, { useCallback, useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { validateElements } from "src/components/Validation/ElementValidation/elementValidation";
import { validateQuestionnaireDetails } from "src/components/Validation/QuestionnaireDetailsValidation/questionnaireDetailsValidation";
import {
  validateTranslations,
  warnMarkdownInTranslations,
} from "src/components/Validation/TranslationValidation/translationValidation";
import { ValidationErrorsModal } from "src/components/Validation/validationErrorsModal";
import {
  getAllQuestionnaires,
  getQuestionnaire,
} from "src/store/treeStore/indexedDbHelper";
import { getInitialState } from "src/store/treeStore/initialState";
import { resetQuestionnaireAction } from "src/store/treeStore/treeActions";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon, { IconSize } from "@helsenorge/designsystem-react/components/Icon";
import Upload from "@helsenorge/designsystem-react/components/Icons/InfoSignStroke";

import AnchorMenu from "../components/AnchorMenu/AnchorMenu";
import FormDetailsDrawer from "../components/Drawer/FormDetailsDrawer/FormDetailsDrawer";
import TranslationModal from "../components/Languages/Translation/TranslationModal";
import Navbar from "../components/Navbar/Navbar";
import QuestionDrawer from "../components/QuestionDrawer/QuestionDrawer";
import FormFillerPreview from "../components/Refero/FormFillerPreview";
import { TreeContext } from "../store/treeStore/treeStore";
import "./FormBuilder.css";
import { ValidationError } from "../utils/validationUtils";

const FormBuilder = (): React.JSX.Element => {
  const { state, dispatch } = useContext(TreeContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showValidationModal, setShowValidationModal] =
    useState<boolean>(false);
  const [itemsErrors, setItemsErrors] = useState<Array<ValidationError>>([]);
  const [translationErrors, setTranslationErrors] = useState<
    Array<ValidationError>
  >([]);
  const [questionnaireDetailsErrors, setQuestionnaireDetailsErrors] = useState<
    Array<ValidationError>
  >([]);
  const [markdownWarning, setMarkdownWarning] = useState<
    ValidationError | undefined
  >(undefined);
  const [translateLang, setTranslateLang] = useState("");

  const onClickValidation = (): void => {
    setItemsErrors(validateElements(t, state));
    setTranslationErrors(validateTranslations(t, state));
    setQuestionnaireDetailsErrors(validateQuestionnaireDetails(t, state));
    setMarkdownWarning(warnMarkdownInTranslations(t, state));
    setShowValidationModal(true);
  };

  const toggleFormDetails = useCallback(() => {
    setShowFormDetails(!showFormDetails);
  }, [showFormDetails]);
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

      <div className="editor">
        <AnchorMenu
          dispatch={dispatch}
          qOrder={state.qOrder}
          qItems={state.qItems}
          qCurrentItem={state.qCurrentItem}
          validationErrors={itemsErrors}
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
      </div>
      <div className="page-wrapper">
        <div className="details-button">
          <Button
            onClick={toggleFormDetails}
            ariaLabel={t("Questionnaire details")}
            size="medium"
            variant="borderless"
          >
            <Icon size={IconSize.Medium} svgIcon={Upload} />
          </Button>
        </div>
        <FormDetailsDrawer
          setTranslateLang={(language: string) => {
            setTranslateLang(language);
            toggleFormDetails();
          }}
          questionnaireDetailsErrors={questionnaireDetailsErrors}
          closeDrawer={toggleFormDetails}
          isOpen={showFormDetails}
        />
        <QuestionDrawer validationErrors={itemsErrors} />
      </div>
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
    </>
  );
};

export default FormBuilder;
