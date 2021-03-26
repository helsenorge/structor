import { QuestionnaireItemAnswerOption } from '../types/fhir';
import createUUID from './CreateUUID';
import { removeSpace } from './formatHelper';

export const createNewSystem = (): string => {
    return `${createUUID()}-system`;
};

export const createNewAnswerOption = (system?: string): QuestionnaireItemAnswerOption => {
    return {
        valueCoding: {
            id: createUUID(),
            code: '',
            system: system,
            display: '',
        },
    } as QuestionnaireItemAnswerOption;
};

export const addEmptyOptionToAnswerOptionArray = (
    values: QuestionnaireItemAnswerOption[],
): QuestionnaireItemAnswerOption[] => {
    // find existing system, if any. Otherwise generate new system
    const system = values.length > 0 ? values[0].valueCoding?.system : createNewSystem();

    // create new answerOption to add
    const newValueCoding = createNewAnswerOption(system);
    return [...values, newValueCoding];
};

export const updateAnswerOption = (
    values: QuestionnaireItemAnswerOption[],
    targetId: string,
    displayValue: string,
): QuestionnaireItemAnswerOption[] => {
    return values.map((x) => {
        return x.valueCoding?.id === targetId
            ? ({
                  valueCoding: {
                      ...x.valueCoding,
                      display: displayValue,
                      code: removeSpace(displayValue),
                  },
              } as QuestionnaireItemAnswerOption)
            : x;
    });
};

export const updateAnswerOptionCode = (
    values: QuestionnaireItemAnswerOption[],
    targetId: string,
    codeValue: string,
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

export const updateAnswerOptionSystem = (
    values: QuestionnaireItemAnswerOption[],
    system: string,
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
    targetId: string,
): QuestionnaireItemAnswerOption[] => {
    return values.filter((x) => x.valueCoding?.id !== targetId);
};

export const reorderPositions = (
    list: QuestionnaireItemAnswerOption[],
    to: number,
    from: number,
): QuestionnaireItemAnswerOption[] => {
    const itemToMove = list.splice(from, 1);
    list.splice(to, 0, itemToMove[0]);
    return list;
};
