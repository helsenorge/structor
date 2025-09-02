import { CodeSystemConceptDesignation } from "fhir/r4";
import { useTranslation } from "react-i18next";
import CodingComponent from "src/components/coding/CodingComponent";
import IdInput from "src/components/valueInputs/IdInput";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import useCodeSystemDesignation from "./useCodeSystemDesignation";

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
  const { updateDesignation, removeCodeSystemDesignation } =
    useCodeSystemDesignation();
  const { t } = useTranslation();

  return (
    <div className={styles.designationContainer}>
      <div>
        <IdInput value={designation.id} />

        <Input
          value={designation.value}
          onChange={(event) =>
            updateDesignation("value", event.target.value, conceptIndex, index)
          }
          label="Value"
        />
        <Input
          value={designation.language}
          onChange={(event) =>
            updateDesignation(
              "language",
              event.target.value,
              conceptIndex,
              index,
            )
          }
          label="Language"
        />
        <div className={styles.useInputContainer}>
          <Label labelTexts={[{ text: "Use" }]}></Label>
          <CodingComponent
            coding={designation.use || { code: "", system: "", display: "" }}
            updateCoding={(value) => {
              updateDesignation("use", value, conceptIndex, index);
            }}
          />
        </div>
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
