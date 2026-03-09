import { useCallback, useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import AnchorMenu from "src/components/AnchorMenu/AnchorMenu";
import { useValidationContext } from "src/contexts/validation/useValidationContext";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon, { IconSize } from "@helsenorge/designsystem-react/components/Icon";
import Settings from "@helsenorge/designsystem-react/components/Icons/Settings";

import FormDetailsDrawer from "../components/Drawer/FormDetailsDrawer/FormDetailsDrawer";
import QuestionDrawer from "../components/QuestionDrawer/QuestionDrawer";
import { TreeContext } from "../store/treeStore/treeStore";

import "./FormBuilder.css";
import styles from "./formbuilder.module.scss";
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
    <div className={styles.mainContenetWrapper}>
      <div className={styles.detailsButton}>
        <Button
          onClick={toggleFormDetails}
          ariaLabel={t("Questionnaire details")}
          size="large"
          variant="borderless"
        >
          <Icon size={IconSize.Large} svgIcon={Settings} />
          {t("Questionnaire details")}
        </Button>
      </div>
      <div>
        <div className={styles.editor}>
          <AnchorMenu
            dispatch={dispatch}
            qOrder={state.qOrder}
            qItems={state.qItems}
            qCurrentItem={state.qCurrentItem}
            validationErrors={itemsErrors}
          />
        </div>
        <div className={styles.pageWrapper}>
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
      </div>
    </div>
  );
};

export default FormBuilder;
