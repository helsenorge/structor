import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import SwitchBtn from "src/components/SwitchBtn/SwitchBtn";
import { IExtensionType } from "src/types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

interface NavigationProps {
  removeExtension: (extensionUrl: string) => void;
  updateExtension: (extension: Extension) => void;
}

const NavigationView = ({
  removeExtension,
  updateExtension,
}: NavigationProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { qMetadata } = state;

  const selected =
    !!qMetadata?.extension?.find((ex) => ex.url === IExtensionType.navigator) ||
    false;

  const getExtension = (): Extension => {
    return {
      url: IExtensionType.navigator,
      valueCodeableConcept: {
        coding: [
          {
            system: IExtensionType.navigatorCodeSystem,
            code: "navigator",
          },
        ],
      },
    };
  };

  return (
    <FormField
      label={t("Navigation")}
      sublabel={t("Choose whether to use the navigator")}
    >
      <SwitchBtn
        onChange={() => {
          const hasNavigatorExtension = !!qMetadata?.extension?.find(
            (ex) => ex.url === IExtensionType.navigator,
          );
          if (hasNavigatorExtension) {
            // remove extension
            removeExtension(IExtensionType.navigator);
          } else {
            // set extension
            updateExtension(getExtension());
          }
        }}
        value={selected}
        label={t("Navigator")}
      />
    </FormField>
  );
};

export default NavigationView;
