import { useCallback, useMemo, useState } from "react";

import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";

import type { CodeSystemContextInputTypes } from "./CodeSystemContextTypes";
import type { CodeSystem } from "fhir/r4";

import { CodeSystemContext } from "./CodeSystemContext";
import { initialCodeSystem } from "../utils";

export type CodeSystemProviderProps = CodeSystemContextInputTypes & {
  initCodeSystem?: CodeSystem;
};

export const CodeSystemProvider = ({
  children,
  initCodeSystem,
}: CodeSystemProviderProps): React.JSX.Element => {
  const [newCodeSystem, setNewCodeSystem] = useState<CodeSystem>(
    initCodeSystem || { ...initialCodeSystem() },
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
