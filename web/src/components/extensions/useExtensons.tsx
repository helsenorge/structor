import { useCallback } from "react";

import { Extension } from "fhir/r4";
import createUUID from "src/helpers/CreateUUID";

import type { ExtensionValueKey } from "./types";

import { getDefaultValueForType } from "./utils";

type UseExtensionsReturn = {
  addNewExtension: () => void;
  removeExtension: ({ extension }: { extension: Extension }) => void;
  updateExtension: ({
    extension,
    field,
    value,
  }: {
    extension: Extension;
    field: keyof Extension;
    value: string | boolean | number | undefined;
  }) => void;
  handleTypeChange: (index: number, newType: ExtensionValueKey) => void;
};

type UpdateExtension = {
  extension: Extension;
  field: keyof Extension;
  value: string | boolean | number | undefined;
  index?: number;
};

type UseExtensionInput = {
  id: string;
  idType?: "linkId" | "id";
  successCallback: (
    extensions: Extension[],
    id: string,
    idType?: "linkId" | "id",
  ) => void;
  extensions: Extension[];
};

export const useExtensions = ({
  id,
  idType = "id",
  successCallback,
  extensions,
}: UseExtensionInput): UseExtensionsReturn => {
  const addNewExtension = (): void => {
    const newExtension: Extension = {
      id: createUUID(),
      url: "",
    };
    successCallback([...extensions, newExtension], id, "id");
  };
  const removeExtension = ({
    extension,
    index,
  }: {
    extension: Extension;
    index?: number;
  }): void => {
    successCallback(
      [
        ...extensions.filter((ext, i) => {
          const hasId = ext.id && extension.id;
          if (index !== undefined) {
            return i !== index;
          }
          if (hasId) {
            return ext.id !== extension.id;
          }
          return ext.url !== extension.url;
        }),
      ],
      id,
      "id",
    );
  };
  const updateExtension = ({
    extension,
    field,
    value,
    index,
  }: UpdateExtension): void => {
    successCallback(
      extensions.map((ext) => {
        const hasId = ext.id && extension.id;
        if (index !== undefined) {
          return ext === extensions[index] ? { ...ext, [field]: value } : ext;
        }
        return hasId
          ? ext.id === extension.id
            ? { ...ext, [field]: value }
            : ext
          : ext.url === extension.url
            ? { ...ext, [field]: value }
            : ext;
      }),
      id,
      "id",
    );
  };
  const handleTypeChange = useCallback(
    (index: number, newType: ExtensionValueKey) => {
      const updatedExtensions = [...extensions];
      const extensionToUpdate = updatedExtensions[index];

      const newExtension: Extension = {
        id: extensionToUpdate.id,
        url: extensionToUpdate.url,
        [newType]: getDefaultValueForType(newType),
      };

      updatedExtensions[index] = newExtension;
      successCallback(updatedExtensions, id, idType);
    },
    [extensions, id, idType, successCallback],
  );
  return {
    addNewExtension,
    removeExtension,
    updateExtension,
    handleTypeChange,
  };
};
