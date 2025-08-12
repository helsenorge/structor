import { CodeSystemConceptProperty } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";

import styles from "./code-system-properties.module.scss";

const CodeSystemProperty = ({
  property,
  index,
  conceptIndex,
}: {
  property: CodeSystemConceptProperty;
  index: number;
  conceptIndex: number;
}): React.JSX.Element => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const { t } = useTranslation();
  const updateProperty = (
    key: keyof CodeSystemConceptProperty,
    value: string,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, idx) =>
        idx === conceptIndex
          ? {
              ...c,
              property: c.property?.map((p, i) =>
                i === index ? { ...p, [key]: value } : p,
              ),
            }
          : c,
      ),
    }));
  };
  const removeCodeSystemProperty = (
    index: number,
    conceptIndex: number,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c, idx) =>
        idx === conceptIndex
          ? {
              ...c,
              property: c.property?.filter((_, i) => i !== index),
            }
          : c,
      ),
    }));
  };
  return (
    <div className={styles.propertyContainer}>
      <div className={styles.inputContainer}>
        <Input
          label={<Label labelTexts={[{ text: "Code" }]} />}
          value={property.code}
          onChange={(e) => updateProperty("code", e.target.value)}
        />
      </div>
      <div className={styles.headerContainer}>
        <Button
          variant="borderless"
          onClick={() => removeCodeSystemProperty(index, conceptIndex)}
          ariaLabel={t("Remove include")}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default CodeSystemProperty;
