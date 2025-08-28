import React from "react";

import { CodeableConcept, Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Label, {
  LabelText,
} from "@helsenorge/designsystem-react/components/Label";

import CodingInput from "./CodingInput";
import StringInput from "./StringInput";

import styles from "./value-input.module.scss";
type Props = {
  label?: LabelText[];
  onChange: (value: CodeableConcept) => void;
  value?: CodeableConcept;
};
const CodeableConceptInput = ({
  label,
  onChange,
  value,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const existingCodings = value?.coding || [];
  const [codings, setCodings] = React.useState<Coding[]>(existingCodings);
  return (
    <div>
      {value && (
        <>
          {label && <Label labelTexts={label} />}
          <StringInput
            label={t("Text")}
            value={value?.text || ""}
            placeholder={t("Enter a codeable concept text..")}
            onChange={(val) => onChange({ ...value, text: val })}
          />
        </>
      )}
      <div className={styles.removeCodingButtonWrapper}>
        <Button
          ariaLabel="Add coding"
          variant="borderless"
          size="large"
          onClick={() => {
            const newCoding: Coding = {
              code: "",
              display: "",
              system: createUriUUID(),
              id: createUUID(),
            };
            setCodings([...codings, newCoding]);
            onChange({ ...value, coding: [...codings, newCoding] });
          }}
        >
          <Icon svgIcon={PlussIcon} />
          <span>{t("Add coding")}</span>
        </Button>
      </div>
      <div className={styles.codeableConceptCodings}>
        {codings.map((coding, index) => (
          <React.Fragment key={coding.id || index}>
            <CodingInput
              className={styles.codingInput}
              value={coding}
              onChange={(newCoding) => {
                const newCodings = [...codings];
                newCodings[index] = newCoding;
                setCodings(newCodings);
                onChange({ ...value, coding: newCodings });
              }}
            />
            <div className={styles.removeCodingButtonWrapper}>
              <Button
                ariaLabel="Remove last coding"
                variant="borderless"
                concept="destructive"
                onClick={() => {
                  const newCodings = [...codings];
                  newCodings.splice(index, 1);
                  setCodings(newCodings);
                  onChange({ ...value, coding: newCodings });
                }}
              >
                <Icon svgIcon={RemoveIcon} />
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default CodeableConceptInput;
