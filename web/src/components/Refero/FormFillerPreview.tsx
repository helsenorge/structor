import React, { useEffect, useState } from "react";

import { Store, configureStore } from "@reduxjs/toolkit";
import { QuestionnaireResponse } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import X from "@helsenorge/designsystem-react/components/Icons/X";

import { Refero, Resources, rootReducer } from "@helsenorge/refero";

import FormFillerSidebar from "./FormFillerSidebar";
import { emptyPropertyReplacer } from "../../helpers/emptyPropertyReplacer";
import { generateQuestionnaireForPreview } from "../../helpers/generateQuestionnaire";
import {
  getLanguagesInUse,
  INITIAL_LANGUAGE,
} from "../../helpers/LanguageHelper";
import { getResources } from "../../locales/referoResources";
import { TreeState } from "../../store/treeStore/treeStore";
import Select from "../Select/Select";

type Props = {
  showFormFiller: () => void;
  language?: string;
  state: TreeState;
};

const FormFillerPreview = ({
  showFormFiller,
  language,
  state,
}: Props): React.JSX.Element => {
  const store: Store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
  const { t } = useTranslation();
  const languages = getLanguagesInUse(state);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    language || state.qMetadata.language || INITIAL_LANGUAGE.code,
  );
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const questionnaireForPreview = JSON.parse(
    JSON.stringify(
      generateQuestionnaireForPreview(
        state,
        selectedLanguage,
        selectedGender,
        selectedAge,
      ),
      emptyPropertyReplacer,
    ),
  );
  const [questionnaireResponse, setQuestionnaireResponse] =
    useState<QuestionnaireResponse>();
  const [showResponse, setShowResponse] = useState<boolean>(false);
  const [referoKey, setReferoKey] = useState<string>("123");

  useEffect(() => {
    setReferoKey(Math.random().toString());
  }, [selectedLanguage, selectedGender, selectedAge]);

  return (
    <Provider store={store}>
      <div className="overlay">
        <div className="preview-window">
          <div className="title align-everything">
            <Button
              ariaLabel={t("Close")}
              onClick={showFormFiller}
              variant="borderless"
            >
              <Icon color="white" svgIcon={X} />
            </Button>
            <h1>{t("Preview")}</h1>
            <div className="pull-right">
              <Select
                value={selectedGender}
                options={[
                  {
                    code: "",
                    display: t("Gender"),
                  },
                  {
                    code: "Kvinne",
                    display: t("Female"),
                  },
                  {
                    code: "Mann",
                    display: t("Male"),
                  },
                  {
                    code: "Ukjent",
                    display: t("Unknown"),
                  },
                ]}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                }}
                compact={true}
              />
              <Select
                value={selectedAge}
                options={[
                  {
                    code: "",
                    display: t("Age"),
                  },
                  ...Array.from(Array(120), (_x, index) => {
                    return {
                      code: index.toString(),
                      display: index.toString(),
                    };
                  }),
                ]}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                }}
                compact={true}
              />
              <Select
                value={selectedLanguage}
                options={languages}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                }}
                compact={true}
              />
            </div>
          </div>

          <FormFillerSidebar questionnaire={questionnaireForPreview} />

          <div className="referoContainer-div">
            <div className="referoInnerContent">
              {!showResponse ? (
                <div className="page_refero">
                  <Refero
                    key={referoKey}
                    store={store}
                    questionnaire={questionnaireForPreview}
                    onCancel={showFormFiller}
                    onSave={(questionnaireResponse: QuestionnaireResponse) => {
                      setQuestionnaireResponse(questionnaireResponse);
                      setShowResponse(true);
                    }}
                    onSubmit={() => {}}
                    authorized={true}
                    resources={
                      getResources(
                        selectedLanguage || language || "",
                      ) as Resources
                    }
                    sticky={true}
                    saveButtonDisabled={false}
                    loginButton={<Button>{"Login"}</Button>}
                    syncQuestionnaireResponse
                    validateScriptInjection
                  />
                </div>
              ) : (
                <div>
                  <code className="json">
                    {JSON.stringify(questionnaireResponse, null, 2)}
                  </code>
                  <Button onClick={() => setShowResponse(false)}>
                    {"Tilbake til skjemautfyller"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default FormFillerPreview;
