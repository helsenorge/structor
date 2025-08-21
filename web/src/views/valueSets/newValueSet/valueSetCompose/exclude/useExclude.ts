import { useCallback, useContext } from "react";

import {
  CodeSystem,
  ValueSetComposeInclude,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { TreeContext } from "src/store/treeStore/treeStore";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";

type ReturnType = {
  getActiveCodeSystems: () => CodeSystem[];
  toggleExclude: (
    conceptToToggle: ValueSetComposeIncludeConcept,
    system?: string,
  ) => void;
  codeIsExcluded: (code: string, system?: string) => boolean;
};
const useExclude = (): ReturnType => {
  const { newValueSet, setNewValueSet } = useValueSetContext();
  const { state } = useContext(TreeContext);

  const getActiveCodeSystems = (): CodeSystem[] => {
    const systemsInValueSet =
      newValueSet?.compose?.include?.map((include) => include.system) || [];
    const existingCodeSystems = state.qContained
      ?.filter((fhirResources) => fhirResources.resourceType === "CodeSystem")
      ?.filter((codeSystem) => systemsInValueSet.includes(codeSystem.url));

    const uniqueCodeSystems = new Map<string | undefined, CodeSystem>();

    systemsInValueSet.forEach((systemInValueset) => {
      existingCodeSystems?.forEach((existing) => {
        if (
          existing?.url === systemInValueset &&
          !uniqueCodeSystems.has(existing?.url)
        ) {
          uniqueCodeSystems.set(existing?.url, existing);
        }
      });
    });

    return Array.from(uniqueCodeSystems.values());
  };
  const toggleExclude = useCallback(
    (conceptToToggle: ValueSetComposeIncludeConcept, system?: string): void => {
      const code = conceptToToggle?.code;
      if (!system || !code) return;

      setNewValueSet((prev) => {
        if (!prev.compose) {
          return prev;
        }
        const compose = prev.compose;
        const exclude = compose?.exclude ?? [];
        const sysIdx = exclude.findIndex((e) => e.system === system);

        if (sysIdx === -1) {
          return {
            ...prev,
            compose: {
              ...compose,
              exclude: [...exclude, { system, concept: [{ code: code }] }],
            },
          };
        }

        const entry = exclude[sysIdx];
        const concepts = entry.concept ?? [];
        const exists = concepts.some((c) => c.code === code);

        const nextConcepts = exists
          ? concepts.filter((c) => c.code !== code)
          : [...concepts, conceptToToggle];

        const nextEntry: ValueSetComposeInclude =
          nextConcepts.length === 0
            ? { system }
            : { ...entry, concept: nextConcepts };

        const nextExclude =
          nextConcepts.length === 0
            ? exclude.filter((_, i) => i !== sysIdx) // drop empty system block
            : exclude.map((e, i) => (i === sysIdx ? nextEntry : e));

        return {
          ...prev,
          compose: { ...compose, exclude: nextExclude },
        };
      });
    },
    [setNewValueSet],
  );
  const codeIsExcluded = (code: string, system?: string): boolean => {
    return (
      newValueSet?.compose?.exclude
        ?.find((e) => e.system === system)
        ?.concept?.some((c) => c.code === code) ?? false
    );
  };
  return {
    getActiveCodeSystems,
    toggleExclude,
    codeIsExcluded,
  };
};
export default useExclude;
