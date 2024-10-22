import React, { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { setItemExtension } from "../../../helpers/extensionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

type ValidationAnswerTypeAttachmentProps = {
  item: QuestionnaireItem;
};

const ValidationAnswerTypeAttachment = ({
  item,
}: ValidationAnswerTypeAttachmentProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const maxSize =
    item.extension?.find((ext) => ext.url === IExtensionType.maxSize)
      ?.valueDecimal || "";

  function updateMaxSize(size: number): void {
    const extension = { url: IExtensionType.maxSize, valueDecimal: size };
    setItemExtension(item, extension, dispatch);
  }

  return (
    <FormField label={t("Max file size in MB")}>
      <input
        defaultValue={maxSize}
        type="number"
        aria-label="maximum filesize"
        onBlur={(e) => updateMaxSize(parseFloat(e.target.value))}
      />
    </FormField>
  );
};

export default ValidationAnswerTypeAttachment;
