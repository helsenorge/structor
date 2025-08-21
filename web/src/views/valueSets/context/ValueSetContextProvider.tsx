import React, { useCallback, useContext, useMemo, useState } from "react";

import {
  Extension,
  ValueSet,
  ValueSetCompose,
  ValueSetComposeInclude,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";
import { TreeContext } from "src/store/treeStore/treeStore";
import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";

import { ValueSetContextInputTypes } from "./ValueSetContextTypes";
import { ValueSetContext } from "./ValuseSetContext";
import { initValueSet } from "../utils/intialValuesets";

export type ValueSetProviderProps = ValueSetContextInputTypes & {
  initialValueSet?: ValueSet;
};

export const ValueSetProvider = ({
  children,
  initialValueSet,
}: ValueSetProviderProps): React.JSX.Element => {
  const { state } = useContext(TreeContext);

  const [newValueSet, setNewValueSet] = useState<ValueSet>(
    initialValueSet || { ...initValueSet() },
  );
  const reset = useCallback((): void => {
    setNewValueSet({
      ...initValueSet(),
    });
  }, []);
  const canEdit = useCallback((type?: string): boolean => {
    return type !== predefinedValueSetUri;
  }, []);

  const handleEdit = useCallback((valueSet: ValueSet): void => {
    const o = JSON.stringify(valueSet);
    setNewValueSet(JSON.parse(o));
  }, []);

  const copyComposeIncludeConcept = useCallback(
    (id?: string, includeIndex = 0): void => {
      const elementToCopy = newValueSet?.compose?.include?.[
        includeIndex
      ]?.concept?.find((x) => x && x.id === id);
      if (!elementToCopy) {
        return;
      }
      const newElement: ValueSetComposeIncludeConcept = {
        ...elementToCopy,
        id: createUUID(),
        extension: (elementToCopy.extension || []).map((ext: Extension) => ({
          ...ext,
          ...(ext.valueCoding && {
            valueCoding: { ...ext.valueCoding, system: createUriUUID() },
          }),
          ...(ext.valueCodeableConcept && {
            valueCodeableConcept: {
              ...ext.valueCodeableConcept,
              ...(ext.valueCodeableConcept.coding && {
                coding: (ext.valueCodeableConcept.coding || []).map(
                  (coding) => ({
                    ...coding,
                    system: createUriUUID(),
                  }),
                ),
              }),
            },
          }),
          ...(ext.valueReference && {
            valueReference: { ...ext.valueReference, id: createUUID() },
          }),

          id: createUUID(),
        })),
      };
      setNewValueSet((prevState) => {
        const updatedCompose: ValueSetCompose = {
          ...prevState?.compose,
          include: [
            {
              ...prevState?.compose?.include[includeIndex],
              concept: [
                ...(prevState?.compose?.include[includeIndex]?.concept || []),
                newElement,
              ],
            } as ValueSetComposeInclude,
          ],
        };
        return {
          ...prevState,
          compose: updatedCompose,
        };
      });
    },
    [newValueSet?.compose?.include],
  );
  const valueSets = useMemo(() => {
    return state.qContained?.filter(
      (item): item is ValueSet => item.resourceType === "ValueSet",
    );
  }, [state.qContained]);
  const value = useMemo(() => {
    return {
      newValueSet,
      setNewValueSet,
      reset,
      canEdit,
      handleEdit,
      copyComposeIncludeConcept,
      valueSets,
    };
  }, [
    newValueSet,
    reset,
    canEdit,
    handleEdit,
    copyComposeIncludeConcept,
    valueSets,
  ]);
  return (
    <ValueSetContext.Provider value={value}>
      {children}
    </ValueSetContext.Provider>
  );
};
