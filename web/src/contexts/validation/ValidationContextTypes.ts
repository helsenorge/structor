import type { ExtendedLanguageLocales } from "src/types/LanguageTypes";
import type { ValidationError } from "src/utils/validationUtils";

export type ValidationType = {
  translateLang: ExtendedLanguageLocales | "";
  setTranslateLang: React.Dispatch<
    React.SetStateAction<ExtendedLanguageLocales | "">
  >;
  setItemsErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  itemsErrors: ValidationError[];
  setQuestionnaireDetailsErrors: React.Dispatch<
    React.SetStateAction<ValidationError[]>
  >;
  questionnaireDetailsErrors: ValidationError[];
};
