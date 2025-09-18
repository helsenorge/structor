import { useTranslation } from "react-i18next";

import Input from "@helsenorge/designsystem-react/components/Input";
type Props = {
  onChange: (value: number) => void;
  value?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const IntegerInput = ({
  onChange,
  value,
  label,
  placeholder,
  disabled,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      label={label || "Value"}
      type="number"
      disabled={disabled}
      value={value || ""}
      placeholder={placeholder || t("Enter an integer value..")}
      onChange={(e) => {
        const intValue = parseInt(e.target.value, 10);
        onChange(isNaN(intValue) ? 0 : intValue);
      }}
    />
  );
};
export default IntegerInput;
