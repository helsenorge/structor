import React, { useContext, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import FormPage from "./FormPage";
import Btn from "../components/Btn/Btn";
import Modal from "../components/Modal/Modal";
import SpinnerBox from "../components/Spinner/SpinnerBox";
import { mapToTreeState } from "../helpers/FhirToTreeStateMapper";
import { getStateFromDb } from "../store/treeStore/indexedDbHelper";
import { resetQuestionnaireAction } from "../store/treeStore/treeActions";
import { TreeContext, TreeState } from "../store/treeStore/treeStore";
import "./FrontPage.css";

const FrontPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const [stateFromStorage, setStateFromStorage] = useState<
    TreeState | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormBuilderShown, setIsFormBuilderShown] = useState<boolean>(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let isMounted = true;

    const getStoredQuestionnaire = async (): Promise<void> => {
      try {
        const indexedDbState = await getStateFromDb();
        if (isMounted) {
          setStateFromStorage(indexedDbState);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to retrieve state from IndexedDB:", error);
      }
    };

    getStoredQuestionnaire();

    return () => {
      isMounted = false;
    };
  }, []);

  const onReaderLoad = (event: ProgressEvent<FileReader>): void => {
    if (event.target?.result) {
      try {
        const content = event.target.result as string;
        const questionnaireObj = JSON.parse(content);
        const importedState = mapToTreeState(questionnaireObj);
        dispatch(resetQuestionnaireAction(importedState));
        setIsFormBuilderShown(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error parsing the questionnaire file:", error);
      } finally {
        setIsLoading(false);
        // Reset file input
        if (uploadRef.current) {
          uploadRef.current.value = "";
        }
      }
    } else {
      setIsLoading(false);
    }
  };

  const uploadQuestionnaire = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (event.target.files && event.target.files[0]) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.onerror = (): void => {
        // eslint-disable-next-line no-console
        console.error("Failed to read file");
        setIsLoading(false);
      };
      reader.readAsText(event.target.files[0]);
    }
  };

  return (
    <>
      {isLoading && (
        <Modal>
          <div className="align-everything">
            <SpinnerBox />
          </div>
          <p className="center-text">{t("Loading questionnaire...")}</p>
        </Modal>
      )}
      {isFormBuilderShown ? (
        <FormPage setStateFromStorage={setStateFromStorage} />
      ) : (
        <>
          <header>
            <div className="form-title">
              <h1>{t("Form builder")}</h1>
            </div>
          </header>
          <div className="frontpage">
            <h2>{t("What would you like to do?")}</h2>
            <div className="frontpage__infotext">
              {t(
                "You can start a new questionnaire, or upload an existing one.",
              )}
            </div>
            <input
              type="file"
              ref={uploadRef}
              onChange={uploadQuestionnaire}
              accept="application/json"
              style={{ display: "none" }}
            />
            <Btn
              onClick={() => {
                setIsFormBuilderShown(true);
              }}
              title={t("New questionnaire")}
              variant="primary"
            />
            {` `}
            <Btn
              onClick={() => {
                uploadRef.current?.click();
              }}
              title={t("Upload questionnaire")}
              variant="secondary"
            />
          </div>
        </>
      )}
    </>
  );
};

export default FrontPage;
