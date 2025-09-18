import { useTranslation } from "react-i18next";

import Input from "@helsenorge/designsystem-react/components/Input";

type Props = {
  onChange: (value: number) => void;
  value?: number;
  label?: string;
  placeholder?: string;
};

const DecimalInput = ({
  value,
  onChange,
  label,
  placeholder,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      label={label || "Value"}
      type="number"
      value={value || ""}
      placeholder={placeholder || t("Enter a decimal value..")}
      onChange={(e) => {
        const floatValue = parseFloat(e.target.value);
        onChange(isNaN(floatValue) ? 0 : floatValue);
      }}
    />
  );
};

export default DecimalInput;
