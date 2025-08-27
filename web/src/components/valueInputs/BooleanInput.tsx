import Checkbox from "@helsenorge/designsystem-react/components/Checkbox";
type Props = {
  onChange: (value: boolean) => void;
  value?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};
const BooleanInput = ({
  onChange,
  value,
  label,
  disabled,
}: Props): React.JSX.Element => {
  return (
    <Checkbox
      label={label ? label : "Value"}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
  );
};
export default BooleanInput;
