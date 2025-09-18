import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { ExtensionValueKey } from "./types";
import { EXTENSION_VALUE_TYPES, getExtensionValue } from "./utils";
import ValueInput from "../valueInputs/ValueInput";

import styles from "./extensions.module.scss";

type ExtensionValue = string | boolean | number | undefined;
const ExtensionItem = ({
  index,
  ext,
  updateExtension,
  handleTypeChange,
  removeExtension,
}: {
  index: number;
  ext: Extension;
  updateExtension: (params: {
    extension: Extension;
    field: keyof Extension;
    value: ExtensionValue;
  }) => void;
  handleTypeChange: (
    index: number,
    newType: Partial<ExtensionValueKey>,
  ) => void;
  removeExtension: (params: { extension: Extension }) => void;
}): React.JSX.Element => {
  const { t } = useTranslation();
  const { type: valueType, value } = getExtensionValue(ext);
  return (
    <>
      <div className={styles.extensionItemInputWrapper}>
        <div>
          <Input
            label={<Label labelTexts={[{ text: "Url", type: "normal" }]} />}
            className={styles.extensionItemInput}
            size="medium"
            disabled={false}
            value={ext.url}
            placeholder={t("Enter an url..")}
            onChange={(event) =>
              updateExtension({
                extension: ext,
                field: "url",
                value: event.target.value,
              })
            }
          />
          <Select
            label={t("Type")}
            value={valueType || ""}
            onChange={(event) =>
              handleTypeChange(
                index,
                event.target.value as Partial<ExtensionValueKey>,
              )
            }
          >
            <option value="" disabled>
              {t("Select a type...")}
            </option>
            {Object.entries(EXTENSION_VALUE_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div className={styles.removeButtonWrapper}>
          <Button
            type="button"
            size="large"
            variant="borderless"
            onClick={() => {
              removeExtension({ extension: ext });
            }}
            name={t("Remove element")}
            concept="destructive"
            ariaLabel={t("Delete extension")}
          >
            <Icon svgIcon={RemoveIcon} />
          </Button>
        </div>
      </div>
      <div className={styles.extensionItemSelectWrapper}>
        {valueType && (
          <ValueInput
            type={valueType}
            value={value as ExtensionValue}
            onChange={(newValue: ExtensionValue) =>
              updateExtension({
                extension: ext,
                field: valueType,
                value: newValue,
              })
            }
          />
        )}
      </div>
    </>
  );
};

export default ExtensionItem;
