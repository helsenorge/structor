import { QuestionnaireItemAnswerOption } from "fhir/r4";

import { IExtensionType } from "../types/IQuestionnareItemType";

import createUUID from "./CreateUUID";
import { removeSpace } from "./formatHelper";
import { createUriUUID } from "./uriHelper";

export const createNewAnswerOption = (
  system?: string
): QuestionnaireItemAnswerOption => {
  return {
    valueCoding: {
      id: createUUID(),
      code: "",
      system: system,
      display: "",
    },
  };
};

export const addEmptyOptionToAnswerOptionArray = (
  values: QuestionnaireItemAnswerOption[]
): QuestionnaireItemAnswerOption[] => {
  // find existing system, if any. Otherwise generate new system
  const system =
    values.length > 0 ? values[0].valueCoding?.system : createUriUUID();

  // create new answerOption to add
  const newValueCoding = createNewAnswerOption(system);
  return [...values, newValueCoding];
};

export const addOrdinalValueExtensionToAllAnswerOptions = (
  values: QuestionnaireItemAnswerOption[],
  scoreValue: string
): QuestionnaireItemAnswerOption[] => {
  const extensionToAdd = {
    url: IExtensionType.ordinalValue,
    valueDecimal: Number(scoreValue),
  };
  return values.map((x) => {
    return {
      valueCoding: {
        ...x.valueCoding,
        extension: x.valueCoding?.extension?.concat(extensionToAdd),
      },
    } as QuestionnaireItemAnswerOption;
  });
};

export const updateAnswerOption = (
  values: QuestionnaireItemAnswerOption[],
  targetId: string,
  displayValue: string
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    return x.valueCoding?.id === targetId
      ? ({
          valueCoding: {
            ...x.valueCoding,
            display: displayValue,
            code: !x.valueCoding.code
              ? removeSpace(displayValue)
              : x.valueCoding.code,
          },
        } as QuestionnaireItemAnswerOption)
      : x;
  });
};

export const updateAnswerOptionCode = (
  values: QuestionnaireItemAnswerOption[],
  targetId: string,
  codeValue: string
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    return x.valueCoding?.id === targetId
      ? ({
          valueCoding: {
            ...x.valueCoding,
            code: codeValue,
          },
        } as QuestionnaireItemAnswerOption)
      : x;
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getExtension = (url: string, scoreValue: string) => {
  if (url === IExtensionType.ordinalValue) {
    return { url: url, valueDecimal: Number(scoreValue) };
  } else if (url === IExtensionType.valueSetLabel) {
    return { url: url, valueString: scoreValue };
  }

  return { url: url };
};

export const updateAnswerOptionExtension = (
  values: QuestionnaireItemAnswerOption[],
  targetId: string,
  scoreValue: string,
  url: string
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    if (x.valueCoding?.id === targetId) {
      const currentExtensions = x.valueCoding.extension || [];
      const index = currentExtensions.findIndex((ext) => ext.url === url);

      let updatedExtensions;
      if (index >= 0) {
        updatedExtensions = [...currentExtensions];
        updatedExtensions[index] = getExtension(url, scoreValue);
      } else {
        updatedExtensions = [
          ...currentExtensions,
          getExtension(url, scoreValue),
        ];
      }

      return {
        ...x,
        valueCoding: {
          ...x.valueCoding,
          extension: updatedExtensions,
        },
      } as QuestionnaireItemAnswerOption;
    } else {
      return x;
    }
  });
};

export const updateAnswerOptionSystem = (
  values: QuestionnaireItemAnswerOption[],
  system: string
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    return {
      valueCoding: {
        ...x.valueCoding,
        system,
      },
    } as QuestionnaireItemAnswerOption;
  });
};

export const removeOptionFromAnswerOptionArray = (
  values: QuestionnaireItemAnswerOption[],
  targetId: string
): QuestionnaireItemAnswerOption[] => {
  return values.filter((x) => x.valueCoding?.id !== targetId);
};

export const removeExtensionFromAnswerOptions = (
  values: QuestionnaireItemAnswerOption[],
  extensionUrl: IExtensionType
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    return {
      valueCoding: {
        ...x.valueCoding,
        extension: x.valueCoding?.extension?.filter(
          (y) => y.url !== extensionUrl
        ),
      } as QuestionnaireItemAnswerOption,
    };
  });
};

export const removeExtensionFromSingleAnswerOption = (
  values: QuestionnaireItemAnswerOption[],
  valueCodingId: string,
  extensionUrl: IExtensionType
): QuestionnaireItemAnswerOption[] => {
  return values.map((x) => {
    return x.valueCoding?.id === valueCodingId
      ? {
          valueCoding: {
            ...x.valueCoding,
            extension: x.valueCoding?.extension?.filter(
              (y) => y.url !== extensionUrl
            ),
          } as QuestionnaireItemAnswerOption,
        }
      : x;
  });
};

export const reorderPositions = (
  list: QuestionnaireItemAnswerOption[],
  to: number,
  from: number
): QuestionnaireItemAnswerOption[] => {
  const itemToMove = list.splice(from, 1);
  list.splice(to, 0, itemToMove[0]);
  return list;
};
