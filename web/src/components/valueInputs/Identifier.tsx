import { Identifier } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { createUriUUID } from "src/helpers/uriHelper";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import CodeableConceptInput from "./CodeableConceptInput";
import StringInput from "./StringInput";

import styles from "./value-input.module.scss";

type Props = {
  onChange: (value: Identifier | undefined) => void;
  value?: Identifier;
};

const IdentifierInput = ({ onChange, value }: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.identifierContainer}>
      <div>
        <Input value={value?.id} disabled />
        <Select
          label={<Label labelTexts={[{ text: t("Use") }]} />}
          value={value?.use}
          onChange={(v) =>
            onChange({
              ...value,
              use: v.target.value as Identifier["use"],
            })
          }
        >
          <option value="">{t("Select an option")}</option>

          <option value="usual">{t("Usual")}</option>
          <option value="official">{t("Official")}</option>
          <option value="temp">{t("Temporary")}</option>
          <option value="secondary">{t("Secondary")}</option>
          <option value="old">{t("Old")}</option>
        </Select>

        <div className={styles.typeInput}>
          <CodeableConceptInput
            label={[{ text: t("Type") }]}
            value={value?.type}
            onChange={(type) => onChange({ ...value, type })}
          />
        </div>
        <StringInput
          label={"System"}
          value={value?.system || createUriUUID()}
          placeholder={t("Enter a quantity system..")}
          onChange={(v) => onChange({ ...value, system: v })}
        />
        <StringInput
          label={"value"}
          value={value?.value || ""}
          placeholder={t("Enter a value..")}
          onChange={(v) => onChange({ ...value, value: v })}
        />
      </div>
      <div className={styles.removeButtonWrapper}>
        <Button
          ariaLabel="Remove quantity"
          variant="borderless"
          onClick={() => onChange(undefined)}
          concept="destructive"
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default IdentifierInput;
