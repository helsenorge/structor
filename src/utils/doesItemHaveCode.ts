import { QuestionnaireItem } from '../types/fhir';

export const doesItemHaveCode = (item: QuestionnaireItem, code: string): boolean => {
    let test = false;
    item.code?.forEach((x) => {
        if (x.code === code) {
            test = true;
        }
    });
    return test;
};
