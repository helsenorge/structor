import { CodeSystemConceptDesignation } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import CodeSystemDesignation from "./CodeSystemDesignation";
import useCodeSystemDesignation from "./useCodeSystemDesignation";

import styles from "./code-system-designations.module.scss";

const CodeSystemDesignations = ({
  designations,
  conceptIndex,
}: {
  designations?: CodeSystemConceptDesignation[];
  conceptIndex: number;
}): React.JSX.Element => {
  const { t } = useTranslation();
  const { handleAddDesignation } = useCodeSystemDesignation();

  return (
    <div className={styles.designationsContainer}>
      <div className={styles.designationHeader}>
        <h3>{"Designations"}</h3>
      </div>
      <Button
        variant="borderless"
        ariaLabel={t("Add designation")}
        onClick={() => handleAddDesignation(conceptIndex)}
      >
        <Icon svgIcon={PlussIcon} /> {t("Add designation")}
      </Button>
      <div className={styles.designationList}>
        {designations?.map(
          (designation: CodeSystemConceptDesignation, index: number) => (
            <CodeSystemDesignation
              designation={designation}
              index={index}
              conceptIndex={conceptIndex}
              key={designation.id || index}
            />
          ),
        )}
      </div>
    </div>
  );
};
export default CodeSystemDesignations;
