import React, { useCallback, useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllQuestionnaires,
  getQuestionnaire,
} from "src/store/treeStore/indexedDbHelper";
import { getInitialState } from "src/store/treeStore/initialState";
import { resetQuestionnaireAction } from "src/store/treeStore/treeActions";

import AnchorMenu from "../components/AnchorMenu/AnchorMenu";
import FormDetailsDrawer from "../components/Drawer/FormDetailsDrawer/FormDetailsDrawer";
import IconBtn from "../components/IconBtn/IconBtn";
import TranslationModal from "../components/Languages/Translation/TranslationModal";
import Navbar from "../components/Navbar/Navbar";
import QuestionDrawer from "../components/QuestionDrawer/QuestionDrawer";
import FormFillerPreview from "../components/Refero/FormFillerPreview";
import { TreeContext } from "../store/treeStore/treeStore";
import "./FormBuilder.css";
import { ValidationErrors } from "../utils/validationUtils";

const FormBuilder = (): React.JSX.Element => {
  const { state, dispatch } = useContext(TreeContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Array<ValidationErrors>
  >([]);
  const [translationErrors, setTranslationErrors] = useState<
    Array<ValidationErrors>
  >([]);
  const [sidebarErrors, setSidebarErrors] = useState<Array<ValidationErrors>>(
    [],
  );
  const [markdownWarning, setMarkdownWarning] = useState<
    ValidationErrors | undefined
  >(undefined);
  const [securityInformation, setSecurityInformation] = useState<
    ValidationErrors | undefined
  >(undefined);
  const [translateLang, setTranslateLang] = useState("");

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
      // eslint-disable-next-line no-console
      console.log("id", id);
      const realId = targetState.qMetadata.id!;
      if (id !== realId) {
        navigate(`/formbuilder/${realId}`, { replace: true });
      }
      // eslint-disable-next-line no-console
      console.log("targetState", targetState);
      dispatch(resetQuestionnaireAction(targetState));
    };

    initialize();
  }, [id, dispatch, navigate]);
  return (
    <>
      <Navbar
        showFormFiller={() => setShowPreview(!showPreview)}
        setValidationErrors={setValidationErrors}
        setTranslationErrors={setTranslationErrors}
        setSidebarErrors={setSidebarErrors}
        setMarkdownWarning={setMarkdownWarning}
        setSecurityInformation={setSecurityInformation}
        setCloseForm={() => {
          navigate("/static_skjemabygger");
        }}
        translationErrors={translationErrors}
        validationErrors={validationErrors}
        sidebarErrors={sidebarErrors}
        markdownWarning={markdownWarning}
        securityInformation={securityInformation}
      />

      <div className="editor">
        <AnchorMenu
          dispatch={dispatch}
          qOrder={state.qOrder}
          qItems={state.qItems}
          qCurrentItem={state.qCurrentItem}
          validationErrors={validationErrors}
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
          />
        )}
      </div>
      <div className="page-wrapper">
        <div className="details-button">
          <IconBtn
            type="info"
            title={t("Questionnaire details")}
            color="black"
            onClick={toggleFormDetails}
            size="large"
          />
        </div>
        <FormDetailsDrawer
          setTranslateLang={(language: string) => {
            setTranslateLang(language);
            toggleFormDetails();
          }}
          sidebarErrors={sidebarErrors}
          closeDrawer={toggleFormDetails}
          isOpen={showFormDetails}
        />
        <QuestionDrawer validationErrors={validationErrors} />
      </div>
    </>
  );
};

export default FormBuilder;
