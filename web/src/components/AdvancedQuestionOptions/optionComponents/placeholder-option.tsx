import { useTranslation } from "react-i18next";

import type { ActionType } from "../../../store/treeStore/treeStore";
import { IExtensionType } from "../../../types/IQuestionnareItemType";
import type { QuestionnaireItem } from "fhir/r4";

import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

type PlaceholderOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
};

export const PlaceholderOption = ({
  item,
  dispatch,
}: PlaceholderOptionProps): JSX.Element => {
  const { t } = useTranslation();

  const getPlaceholder =
    item?.extension?.find((x) => x.url === IExtensionType.entryFormat)
      ?.valueString ?? "";

  return (
    <FormField label={t("Placeholder text")}>
      <InputField
        defaultValue={getPlaceholder}
        onBlur={(e) => {
          if (e.target.value) {
            const extension = {
              url: IExtensionType.entryFormat,
              valueString: e.target.value,
            };
            setItemExtension(item, extension, dispatch);
          } else {
            removeItemExtension(item, IExtensionType.entryFormat, dispatch);
          }
        }}
      />
    </FormField>
  );
};
