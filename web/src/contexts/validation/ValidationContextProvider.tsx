import React, { useState } from "react";

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
  return (
    <ValidationContext.Provider
      value={{
        translateLang,
        setTranslateLang,
        itemsErrors,
        setItemsErrors,
        questionnaireDetailsErrors,
        setQuestionnaireDetailsErrors,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};
