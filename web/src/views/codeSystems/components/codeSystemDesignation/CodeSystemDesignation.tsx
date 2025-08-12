import { CodeSystemConceptDesignation } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";

import styles from "./code-system-designations.module.scss";

const CodeSystemDesignation = ({
  designation,
  conceptIndex,
  index,
}: {
  designation: CodeSystemConceptDesignation;
  conceptIndex: number;
  index: number;
}): React.JSX.Element => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const { t } = useTranslation();

  const updateDesignation = (
    key: keyof CodeSystemConceptDesignation,
    value: string,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: c.designation?.map((d, j) =>
                j === index ? { ...d, [key]: value } : d,
              ),
            }
          : c,
      ),
    }));
  };
  const removeCodeSystemDesignation = (
    index: number,
    conceptIndex: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, i) =>
        i === conceptIndex
          ? {
              ...c,
              designation: c.designation?.filter((_, j) => j !== index),
            }
          : c,
      ),
    }));
  };
  return (
    <div className={styles.designationContainer}>
      <div className={styles.inputContainer}>
        <Input
          disabled
          value={designation.id}
          onChange={(event) => updateDesignation("id", event.target.value)}
        />
        <Input
          value={designation.value}
          onChange={(event) => updateDesignation("value", event.target.value)}
          label="Value"
        />
        <Input
          value={designation.language}
          onChange={(event) =>
            updateDesignation("language", event.target.value)
          }
          label="Language"
        />
      </div>
      <div className={styles.headerContainer}>
        <Button
          variant="borderless"
          onClick={() => removeCodeSystemDesignation(index, conceptIndex)}
          ariaLabel={t("Remove include")}
          concept="destructive"
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default CodeSystemDesignation;
