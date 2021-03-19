import { Element, Extension } from '../types/fhir';

// set extension value. Update extension if it exists, otherwise add it.
export const updateExtensionValue = (extensionParent: Element | undefined, extensionValue: Extension): Extension[] => {
    // copy existing extension, except extension to add
    const updatedExtensions = [
        ...(extensionParent?.extension?.filter((x: Extension) => x.url !== extensionValue.url) || []),
    ];

    // add new extension
    updatedExtensions.push(extensionValue);

    return updatedExtensions;
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
