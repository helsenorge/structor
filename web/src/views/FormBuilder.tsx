import React, { useCallback, useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import AnchorMenu from "src/components/AnchorMenu/AnchorMenu";
import { useValidationContext } from "src/contexts/validation/useValidationContext";

import FormDetailsDrawer from "../components/Drawer/FormDetailsDrawer/FormDetailsDrawer";
import IconBtn from "../components/IconBtn/IconBtn";
import QuestionDrawer from "../components/QuestionDrawer/QuestionDrawer";
import { TreeContext } from "../store/treeStore/treeStore";
import "./FormBuilder.css";

const FormBuilder = (): React.JSX.Element => {
  const { setTranslateLang, itemsErrors, questionnaireDetailsErrors } =
    useValidationContext();
  const { dispatch, state } = useContext(TreeContext);

  const { t } = useTranslation();
  const [showFormDetails, setShowFormDetails] = useState(false);

  const toggleFormDetails = useCallback(() => {
    setShowFormDetails(!showFormDetails);
  }, [showFormDetails]);

  return (
    <>
      <div className="editor">
        <AnchorMenu
          dispatch={dispatch}
          qOrder={state.qOrder}
          qItems={state.qItems}
          qCurrentItem={state.qCurrentItem}
          validationErrors={itemsErrors}
        />
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
          questionnaireDetailsErrors={questionnaireDetailsErrors}
          closeDrawer={toggleFormDetails}
          isOpen={showFormDetails}
        />
        <QuestionDrawer validationErrors={itemsErrors} />
      </div>
    </>
  );
};

export default FormBuilder;
