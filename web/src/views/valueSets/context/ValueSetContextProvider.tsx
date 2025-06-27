import React, { useState } from "react";

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
  const reset = (): void => {
    setNewValueSet({
      ...initValueSet(),
    });
  };
  const canEdit = (type?: string): boolean => {
    return type !== predefinedValueSetUri;
  };

  const handleEdit = (valueSet: ValueSet): void => {
    const o = JSON.stringify(valueSet);
    setNewValueSet(JSON.parse(o));
  };
  return (
    <ValueSetContext.Provider
      value={{
        newValueSet,
        setNewValueSet,
        reset,
        canEdit,
        handleEdit,
      }}
    >
      {children}
    </ValueSetContext.Provider>
  );
};
