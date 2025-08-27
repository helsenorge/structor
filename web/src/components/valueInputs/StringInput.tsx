import { useTranslation } from "react-i18next";

import Input from "@helsenorge/designsystem-react/components/Input";

type Props = {
  onChange: (value: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
};

const StringInput = ({
  value,
  onChange,
  label,
  placeholder,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      label={label || "Value"}
      type="text"
      value={String(value)}
      placeholder={placeholder || t("Enter a value..")}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default StringInput;
