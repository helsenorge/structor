import { QuestionnaireItemAnswerOption } from '../types/fhir';
import createUUID from './CreateUUID';

export const createNewAnswerOption = (system?: string): QuestionnaireItemAnswerOption => {
    return {
        valueCoding: {
            code: createUUID(),
            system: system,
            display: '',
        },
    } as QuestionnaireItemAnswerOption;
};

export const addEmptyOptionToAnswerOptionArray = (
    values: QuestionnaireItemAnswerOption[],
    linkId: string,
): QuestionnaireItemAnswerOption[] => {
    // find existing system, if any. Otherwise generate new system
    const system = values.length > 0 ? values[0].valueCoding.system : `${linkId}-system`;

    // create new answerOption to add
    const newValueCoding = createNewAnswerOption(system);
    return [...values, newValueCoding];
};

export const updateAnswerOption = (
    values: QuestionnaireItemAnswerOption[],
    targetCode: string,
    displayValue: string,
): QuestionnaireItemAnswerOption[] => {
    return values.map((x) => {
        return x.valueCoding.code === targetCode
            ? ({
                  valueCoding: {
                      ...x.valueCoding,
                      display: displayValue,
                  },
              } as QuestionnaireItemAnswerOption)
            : x;
    });
};

export const removeOptionFromAnswerOptionArray = (
    values: QuestionnaireItemAnswerOption[],
    targetCode: string,
): QuestionnaireItemAnswerOption[] => {
    return values.filter((x) => x.valueCoding.code !== targetCode);
};
