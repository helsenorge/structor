import { ValidationError } from "src/utils/validationUtils";

export type ValidationType = {
  translateLang: string;
  setTranslateLang: React.Dispatch<React.SetStateAction<string>>;
  setItemsErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  itemsErrors: ValidationError[];
  setQuestionnaireDetailsErrors: React.Dispatch<
    React.SetStateAction<ValidationError[]>
  >;
  questionnaireDetailsErrors: ValidationError[];
};
