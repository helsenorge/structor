import { useContext } from "react";

import { CodeSystem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { TreeContext } from "src/store/treeStore/treeStore";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";

import Button from "@helsenorge/designsystem-react/components/Button";
import Label from "@helsenorge/designsystem-react/components/Label";

import styles from "./import-code-systems.module.scss";

export const ImportCodeSystem = (): React.JSX.Element => {
  const { state } = useContext(TreeContext);
  const { newValueSet, setNewValueSet } = useValueSetContext();
  const { t } = useTranslation();

  const handleImportCodeSystem = (codeSystemUrl: string): void => {
    setNewValueSet((prevState) => {
      const codeSystem: CodeSystem | undefined = state.qContained?.find(
        (item) =>
          item.resourceType === "CodeSystem" && item.url === codeSystemUrl,
      ) as CodeSystem;
      if (codeSystem) {
        return {
          ...prevState,
          compose: {
            ...prevState.compose,
            include: [
              ...(prevState.compose?.include || []),
              {
                system: codeSystem.url,
                concept: codeSystem.concept?.map((concept) => ({
                  ...concept,
                })),
              },
            ],
          },
        };
      }
      return prevState;
    });
  };
  const codeSystems = state.qContained?.filter(
    (item) => item.resourceType === "CodeSystem",
  );
  return (
    <>
      {codeSystems && codeSystems?.length > 0 && (
        <div className={styles.codeSystemsContainer}>
          <Label labelTexts={[{ text: t("Code systems") }]} />

          {codeSystems
            ?.filter((cs) => cs.url)
            ?.filter(
              (cs, index, self) =>
                index === self.findIndex((t) => t.url === cs.url),
            )
            ?.map((item) => (
              <div key={item.id} className={styles.codeSystemItem}>
                <span>{item.url}</span>
                <Button
                  disabled={newValueSet.compose?.include?.some(
                    (inc) => inc.system === item.url,
                  )}
                  variant="borderless"
                  onClick={() => handleImportCodeSystem(item.url!)}
                >
                  {t("Import")}
                </Button>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
