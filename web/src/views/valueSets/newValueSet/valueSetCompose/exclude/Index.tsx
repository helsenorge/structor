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

import useExclude from "./useExclude";

import styles from "./valueset-compose-exclude.module.scss";
const ValueSetComposeExclude = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { getActiveCodeSystems, toggleExclude, codeIsExcluded } = useExclude();

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
                      {"Excluded"}
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
