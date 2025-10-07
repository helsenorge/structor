import React from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { ValidationError } from "src/utils/validationUtils";

import Button from "@helsenorge/designsystem-react/components/Button";
import Expander from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import ExtensionItem from "./ExtensionItem";
import { useExtensions } from "./useExtensons";
import {
  ErrorClassVariant,
  getSeverityClass,
} from "../Validation/validationHelper";

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
  validationErrors?: (index: number) => ValidationError[] | undefined;
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
  validationErrors,
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
          const errorclass = getSeverityClass(
            ErrorClassVariant.highlight,
            validationErrors && validationErrors(index),
          );
          return (
            <section
              className={`${styles.extensionItem} ${borderClass()} ${errorclass}`}
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
