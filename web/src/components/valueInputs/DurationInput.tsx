import type { Duration } from "fhir/r4";

import Button from "@helsenorge/designsystem-react/components/Button";
import Input from "@helsenorge/designsystem-react/components/Input";
import Select from "@helsenorge/designsystem-react/components/Select";

import styles from "./value-input.module.scss";

const UNIT_OPTIONS = [
  { value: "a", label: "Years", code: "a" },
  { value: "mo", label: "Months", code: "mo" },
  { value: "wk", label: "Weeks", code: "wk" },
  { value: "d", label: "Days", code: "d" },
  { value: "h", label: "Hours", code: "h" },
  { value: "min", label: "Minutes", code: "min" },
  { value: "s", label: "Seconds", code: "s" },
];

const DurationInput = ({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (newValue: Duration | undefined) => void;
}): React.JSX.Element => {
  const handleValueChange = (newValue: number): void => {
    onChange({
      ...value,
      value: newValue,
    });
  };

  const handleUnitChange = (code: string): void => {
    const selectedUnit = UNIT_OPTIONS.find((opt) => opt.code === code);
    onChange({
      ...value,
      unit: selectedUnit?.label,
      code: selectedUnit?.code,
      system: "http://unitsofmeasure.org",
    });
  };

  return (
    <div className={styles.durationContainer}>
      <div className={styles.durationInputContainer}>
        <Input
          type="number"
          value={value.value?.toString() || "0"}
          onChange={(e) => handleValueChange(Number(e.target.value))}
          label="Duration"
        />
        <Select
          value={value.code || "d"}
          onChange={(e) => handleUnitChange(e.target.value)}
          label="Unit"
        >
          {UNIT_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
      <div className={styles.durationButtonContainer}>
        <Button
          ariaLabel="clear duration"
          variant="borderless"
          onClick={() => onChange(undefined)}
        >
          {"Clear"}
        </Button>
      </div>
    </div>
  );
};

export default DurationInput;
