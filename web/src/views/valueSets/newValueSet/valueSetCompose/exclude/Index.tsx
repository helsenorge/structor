import { useCallback, useContext } from "react";

import { map } from "@nosferatu500/react-sortable-tree";
import {
  CodeSystem,
  ValueSetComposeInclude,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { useTranslation } from "react-i18next";
import { TreeContext } from "src/store/treeStore/treeStore";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/X";
import Label from "@helsenorge/designsystem-react/components/Label";

import styles from "./valueset-compose-exclude.module.scss";
const ValueSetComposeExclude = (): React.JSX.Element => {
  const { newValueSet, setNewValueSet } = useValueSetContext();
  const { t } = useTranslation();
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
  return (
    <div>
      {getActiveCodeSystems()?.map((codeSystem) => (
        <div key={codeSystem?.id}>
          <Label
            labelTexts={[
              { text: codeSystem?.name || "" },
              { text: ` - ${codeSystem?.url || ""}`, type: "subdued" },
            ]}
          />
          <div className={styles.excludeConcept}>
            {codeSystem?.concept?.map((concept) => (
              <div
                className={`${styles.excludeConceptItem} ${codeIsExcluded(concept?.code, codeSystem.url) && styles.excludedConcept}`}
                key={concept?.id}
              >
                <div>
                  {codeIsExcluded(concept?.code, codeSystem.url) && (
                    <div className={styles.excludedIconContainer}>
                      <Icon size={25} svgIcon={TrashCan} />
                      {"Excluded"}{" "}
                    </div>
                  )}
                  <span>
                    {concept?.display || ""}
                    {concept?.code && ` - ${concept?.code}`}
                  </span>
                </div>
                {!codeIsExcluded(concept?.code, codeSystem.url) && (
                  <Button
                    variant={"borderless"}
                    onClick={() => toggleExclude(concept, codeSystem.url)}
                  >
                    {t("Exclude")}
                  </Button>
                )}
                {codeIsExcluded(concept?.code, codeSystem.url) && (
                  <Button
                    variant={"borderless"}
                    onClick={() => toggleExclude(concept, codeSystem.url)}
                  >
                    {t("Include")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ValueSetComposeExclude;
