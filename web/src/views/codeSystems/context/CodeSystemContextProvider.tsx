import React, { useCallback, useMemo, useState } from "react";

import { CodeSystem } from "fhir/r4";
import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";

import { CodeSystemContext } from "./CodeSystemContext";
import { CodeSystemContextInputTypes } from "./CodeSystemContextTypes";
import { initialCodeSystem } from "../utils";

export type CodeSystemProviderProps = CodeSystemContextInputTypes & {
  initialValueSet?: CodeSystem;
};

export const CodeSystemProvider = ({
  children,
  initialValueSet,
}: CodeSystemProviderProps): React.JSX.Element => {
  const [newCodeSystem, setNewCodeSystem] = useState<CodeSystem>(
    initialValueSet || { ...initialCodeSystem() },
  );
  const reset = useCallback((): void => {
    setNewCodeSystem({
      ...initialCodeSystem(),
    });
  }, []);
  const canEdit = useCallback((type?: string): boolean => {
    return type !== predefinedValueSetUri;
  }, []);

  const handleEdit = useCallback((codeSystem: CodeSystem): void => {
    const o = JSON.stringify(codeSystem);
    setNewCodeSystem(JSON.parse(o));
  }, []);

  const value = useMemo(() => {
    return {
      newCodeSystem,
      setNewCodeSystem,
      reset,
      canEdit,
      handleEdit,
    };
  }, [newCodeSystem, reset, canEdit, handleEdit]);
  return (
    <CodeSystemContext.Provider value={value}>
      {children}
    </CodeSystemContext.Provider>
  );
};
