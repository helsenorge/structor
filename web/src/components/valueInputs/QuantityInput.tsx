import { Quantity } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { createUriUUID } from "src/helpers/uriHelper";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import DecimalInput from "./DecimalInput";
import StringInput from "./StringInput";

import styles from "./value-input.module.scss";

type Props = {
  onChange: (value: Quantity | undefined) => void;
  value?: Quantity;
};

const QuantityInput = ({ onChange, value }: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.durationContainer}>
      <div>
        <DecimalInput
          value={value?.value}
          onChange={(v) => onChange({ ...value, value: v })}
          label={t("Value")}
          placeholder={t("Enter a quantity value..")}
        />
        <Input
          label={"Unit"}
          type="text"
          value={value?.unit || ""}
          placeholder={t("Enter a quantity unit..")}
          onChange={(e) => onChange({ ...value, unit: e.target.value })}
        />
        <StringInput
          label={"System"}
          value={value?.system || createUriUUID()}
          placeholder={t("Enter a quantity system..")}
          onChange={(v) => onChange({ ...value, system: v })}
        />
        <StringInput
          label={"Code"}
          value={value?.code || ""}
          placeholder={t("Enter a quantity code..")}
          onChange={(v) => onChange({ ...value, code: v })}
        />
      </div>
      <div className={styles.removeButtonWrapper}>
        <Button
          ariaLabel="Remove quantity"
          variant="borderless"
          concept="destructive"
          onClick={() => onChange(undefined)}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default QuantityInput;
