import React from "react";

import { useTranslation } from "react-i18next";

import Input from "@helsenorge/designsystem-react/components/Input";

import { isUriValid } from "../../helpers/uriHelper";
import {
  ErrorClassVariant,
  getSeverityClassByLevelAndType,
} from "../Validation/validationHelper";
import { ErrorLevel } from "../Validation/validationTypes";

type Props = {
  value: string | undefined;
  disabled?: boolean;
  testId?: string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
};

const UriFieldFr = ({
  value,
  disabled,
  testId,
  onBlur,
  label,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const ref = React.useRef<HTMLInputElement>(null);
  const [hasValidUri, setHasValidUri] = React.useState<boolean>(
    isUriValid(value || ""),
  );

  React.useEffect(() => {
    // if new value is sent as prop, set this as the current value
    if (ref.current) {
      ref.current.value = value || "";
    }
    setHasValidUri(!value || isUriValid(value || ""));
  }, [value]);

  return (
    <>
      <Input
        label={label || t("System")}
        data-testid={testId}
        disabled={disabled}
        ref={ref}
        placeholder={t("Enter uri..")}
        defaultValue={value || ""}
        onBlur={onBlur}
        onChange={(event) => {
          setHasValidUri(!event.target.value || isUriValid(event.target.value));
        }}
      />
      {!hasValidUri && (
        <div
          className={getSeverityClassByLevelAndType(
            ErrorLevel.error,
            ErrorClassVariant.text,
          )}
          aria-live="polite"
        >
          {t("Uri must start with http://, https:// or urn:uuid:")}
        </div>
      )}
    </>
  );
};

export default UriFieldFr;
