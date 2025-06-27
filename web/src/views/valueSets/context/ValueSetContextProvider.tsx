import React, { useCallback, useMemo, useState } from "react";

import { ValueSet } from "fhir/r4";
import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";

import { ValueSetContextInputTypes } from "./ValueSetContextTypes";
import { ValueSetContext } from "./ValuseSetContext";
import { initValueSet } from "../utils/intialValuesets";

export type ValueSetProviderProps = ValueSetContextInputTypes;

export const ValueSetProvider = ({
  children,
}: ValueSetProviderProps): React.JSX.Element => {
  const [newValueSet, setNewValueSet] = useState<ValueSet>({
    ...initValueSet(),
  });
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
  const value = useMemo(() => {
    return {
      newValueSet,
      setNewValueSet,
      reset,
      canEdit,
      handleEdit,
    };
  }, [newValueSet, reset, canEdit, handleEdit]);
  return (
    <ValueSetContext.Provider value={value}>
      {children}
    </ValueSetContext.Provider>
  );
};
