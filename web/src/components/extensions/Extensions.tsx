import React from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Expander from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { ExtensionValueKey } from "./types";
import { useExtensions } from "./useExtensons";
import { EXTENSION_VALUE_TYPES, getExtensionValue } from "./utils";
import ValueInput from "../valueInputs/ValueInput";

import styles from "./extensions.module.scss";

type BorderType = "underline" | "full";

type Props = {
  extensions?: Extension[];
  id: string;
  idType?: "linkId" | "id";
  updateExtensions: (
    extensions: Extension[],
    id: string,
    idType?: "linkId" | "id",
  ) => void;
  hasValidationError?: (index: number) => boolean;
  className?: string;
  buttonText?: string;
  borderType?: BorderType;
  collapsable?: boolean;
};

export const Extensions = ({
  id,
  idType = "id",
  extensions,
  updateExtensions,
  hasValidationError,
  className,
  buttonText = "Add",
  borderType = "underline",
  collapsable = false,
}: Props): React.JSX.Element | null => {
  const {
    addNewExtension,
    removeExtension,
    updateExtension,
    handleTypeChange,
  } = useExtensions({
    id,
    idType,
    extensions: extensions || [],
    successCallback: updateExtensions,
  });
  const { t } = useTranslation();
  const borderClass = (): string => {
    switch (borderType) {
      case "underline":
        return styles.underline;
      case "full":
        return styles.full;
      default:
        return "";
    }
  };
  return (
    <div className={`${styles.extensionsContainer} ${className || ""}`}>
      <header className={styles.extensionsHeader}>
        <Button
          variant="borderless"
          onClick={() => {
            addNewExtension();
          }}
          ariaLabel={t("Add extension")}
        >
          <Icon svgIcon={PlussIcon} />

          {t(buttonText)}
        </Button>
      </header>

      <ExpanderList>
        {extensions?.map((ext, index) => {
          const hasError = hasValidationError
            ? hasValidationError(index)
            : false;
          return (
            <section
              className={`${styles.extensionItem} ${borderClass()} ${hasError ? styles.error : ""}`}
              key={ext.id}
            >
              {collapsable ? (
                <Expander
                  title={ext.url || t("New Extension")}
                  expanded={index === 0}
                  contentClassNames={styles.extensionExpanderItem}
                >
                  <ExtensionItem
                    index={index}
                    ext={ext}
                    updateExtension={updateExtension}
                    handleTypeChange={handleTypeChange}
                    removeExtension={removeExtension}
                  />
                </Expander>
              ) : (
                <ExtensionItem
                  index={index}
                  ext={ext}
                  updateExtension={updateExtension}
                  handleTypeChange={handleTypeChange}
                  removeExtension={removeExtension}
                />
              )}
            </section>
          );
        })}
      </ExpanderList>
    </div>
  );
};

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
    value: string | boolean | number | undefined;
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
            value={value as string | boolean | number | undefined}
            onChange={(newValue: string | boolean | number | undefined) =>
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
