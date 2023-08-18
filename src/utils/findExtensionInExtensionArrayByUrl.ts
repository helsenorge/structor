import { Extension } from '../types/fhir';

export const findExtensionInExtensionArrayByUrl = (extensionArray: Extension[], url: string): Extension | undefined => {
    let arrayToReturn: Extension = { url: '', valueDecimal: 0 };
    extensionArray.find((x) => {
        if (x.url === url) {
            arrayToReturn = x;
        }
    });
    if (arrayToReturn.url !== '' && arrayToReturn.valueDecimal !== 0) {
        return arrayToReturn;
    }
};
