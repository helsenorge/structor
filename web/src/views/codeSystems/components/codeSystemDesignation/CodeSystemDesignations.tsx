import { CodeSystemConceptDesignation } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import CodeSystemDesignation from "./CodeSystemDesignation";
import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialDesignation } from "../../utils";

import styles from "./code-system-designations.module.scss";

const CodeSystemDesignations = ({
  designations,
  conceptIndex,
}: {
  designations?: CodeSystemConceptDesignation[];
  conceptIndex: number;
}): React.JSX.Element => {
  const { t } = useTranslation();
  const { setNewCodeSystem } = useCodeSystemContext();
  const handleAddDesignation = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: [...(c.designation || []), initialDesignation()],
            }
          : c,
      ),
    }));
  };
  return (
    <div className={styles.designationsContainer}>
      <div className={styles.designationHeader}>
        <h3>{"Designations"}</h3>
        <Button
          variant="borderless"
          ariaLabel="test"
          onClick={handleAddDesignation}
        >
          <Icon svgIcon={PlussIcon} /> {t("Add designation")}
        </Button>
      </div>
      <div className={styles.designationList}>
        {designations?.map(
          (designation: CodeSystemConceptDesignation, index: number) => (
            <CodeSystemDesignation
              designation={designation}
              index={index}
              conceptIndex={conceptIndex}
              key={index}
            />
          ),
        )}
      </div>
    </div>
  );
};
export default CodeSystemDesignations;
