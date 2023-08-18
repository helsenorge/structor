import { QuestionnaireItem } from '../types/fhir';

export const doesItemHaveCode = (item: QuestionnaireItem, code: string): boolean => {
    let itemHasCode = false;
    item.code?.forEach((x) => {
        if (x.code === code) {
            itemHasCode = true;
        }
    });
    return itemHasCode;
};
