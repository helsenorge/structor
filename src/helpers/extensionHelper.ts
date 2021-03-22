import { Element, Extension } from '../types/fhir';
import { IExtentionType } from '../types/IQuestionnareItemType';
import createUUID from './CreateUUID';

// set extension value. Update extension if it exists, otherwise add it.
export const setExtensionValue = (extensionParent: Element | undefined, extensionValue: Extension): Element => {
    // copy existing extension, except extension to add
    const newValue = {
        extension: [...(extensionParent?.extension?.filter((x: Extension) => x.url !== extensionValue.url) || [])],
    };

    // add new extension extension
    newValue.extension.push(extensionValue);

    return newValue;
};

export const removeExtensionValue = (
    extensionParent: Element | undefined,
    extensionUrlToRemove: string,
): Element | undefined => {
    // remove extension with extensionUrlToRemove, but keep other extensions
    let newValue: Element | undefined;
    if (extensionParent) {
        newValue = {
            ...extensionParent,
            extension: (extensionParent.extension || []).filter((x: Extension) => x.url !== extensionUrlToRemove),
        };
    }
    // if there are no extension, clear extensionParent
    if (newValue && newValue.extension && newValue.extension.length === 0) {
        newValue = undefined;
    }

    return newValue;
};

export const createOpenReferanceExtensions = [
    {
        url: IExtentionType.optionReference,
        valueReference: {
            reference: '',
            display: '',
            id: createUUID(),
        },
    },
    {
        url: IExtentionType.optionReference,
        valueReference: {
            reference: '',
            display: '',
            id: createUUID(),
        },
    },
];

export const createDropdown = {
    url: IExtentionType.itemControl,
    valueCodeableConcept: {
        coding: [
            {
                system: IExtentionType.itemControlValueSet,
                code: 'drop-down',
            },
        ],
    },
};
