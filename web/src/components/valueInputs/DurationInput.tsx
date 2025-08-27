import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import IntegerInput from "./IntegerInput";

import styles from "./value-input.module.scss";

const DurationInput = ({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (newValue: Duration | undefined) => void;
}): React.JSX.Element => {
  return (
    <div className={styles.durationContainer}>
      <div className={styles.durationInputContainer}>
        <IntegerInput
          value={value.years || 0}
          onChange={(newValue) => onChange({ ...value, years: newValue })}
          label="Years"
        />
        <IntegerInput
          value={value.months || 0}
          onChange={(newValue) => onChange({ ...value, months: newValue })}
          label="Months"
        />
        <IntegerInput
          value={value.weeks || 0}
          onChange={(newValue) => onChange({ ...value, weeks: newValue })}
          label="Weeks"
        />
        <IntegerInput
          value={value.days || 0}
          onChange={(newValue) => onChange({ ...value, days: newValue })}
          label="Days"
        />
        <IntegerInput
          value={value.hours || 0}
          onChange={(newValue) => onChange({ ...value, hours: newValue })}
          label="Hours"
        />
      </div>
      <div className={styles.durationButtonContainer}>
        <Button
          ariaLabel="clear duration"
          variant="borderless"
          onClick={() => {
            onChange(undefined);
          }}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};

export default DurationInput;
