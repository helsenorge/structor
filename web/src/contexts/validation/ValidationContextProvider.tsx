import React, { useMemo, useState } from "react";

import { ValidationError } from "src/utils/validationUtils";

import { ValidationContext } from "./ValidationContext";

export type ValidationProviderProps = {
  children: React.ReactNode;
};

export const ValidationProvider = ({
  children,
}: ValidationProviderProps): React.JSX.Element => {
  const [translateLang, setTranslateLang] = useState("");
  const [itemsErrors, setItemsErrors] = useState<Array<ValidationError>>([]);
  const [questionnaireDetailsErrors, setQuestionnaireDetailsErrors] = useState<
    Array<ValidationError>
  >([]);
  const values = useMemo(() => {
    return {
      translateLang,
      setTranslateLang,
      itemsErrors,
      setItemsErrors,
      questionnaireDetailsErrors,
      setQuestionnaireDetailsErrors,
    };
  }, [translateLang, itemsErrors, questionnaireDetailsErrors]);
  return (
    <ValidationContext.Provider value={values}>
      {children}
    </ValidationContext.Provider>
  );
};
