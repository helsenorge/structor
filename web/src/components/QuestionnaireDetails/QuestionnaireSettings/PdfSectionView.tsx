import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import CheckboxBtn from "src/components/CheckboxBtn/CheckboxBtn";
import SwitchBtn from "src/components/SwitchBtn/SwitchBtn";
import {
  isVisibilityHideHelp,
  isVisibilityHideSidebar,
  isVisibilityHideSublabel,
  setItemControlExtension,
  VisibilityType,
} from "src/helpers/globalVisibilityHelper";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

interface PdfSectionProps {
  updateExtension: (extension: Extension) => void;
}

const PdfSectionView = ({
  updateExtension,
}: PdfSectionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { qMetadata } = state;

  const getGeneratePdfValue = (): boolean => {
    const extension = qMetadata?.extension?.find(
      (ex) => ex.url === IExtensionType.generatePDF,
    );
    return extension ? extension.valueBoolean || false : true;
  };

  return (
    <FormField
      label={t("PDF")}
      sublabel={t(
        "Here you choose whether you want to generate a PDF and whether you want to hide some texts when the PDF is generated",
      )}
    >
      <SwitchBtn
        onChange={() =>
          updateExtension({
            url: IExtensionType.generatePDF,
            valueBoolean: !getGeneratePdfValue(),
          })
        }
        value={getGeneratePdfValue()}
        label={t("Generate PDF on submit")}
      />
      <CheckboxBtn
        onChange={() =>
          setItemControlExtension(qMetadata, VisibilityType.hideHelp, dispatch)
        }
        checked={isVisibilityHideHelp(qMetadata)}
        value={VisibilityType.hideHelp}
        label={t("Hide help texts in PDF")}
      />
      <CheckboxBtn
        onChange={() =>
          setItemControlExtension(
            qMetadata,
            VisibilityType.hideSublabel,
            dispatch,
          )
        }
        checked={isVisibilityHideSublabel(qMetadata)}
        value={VisibilityType.hideSublabel}
        label={t("Hide sublabels in PDF")}
      />
      <CheckboxBtn
        onChange={() =>
          setItemControlExtension(
            qMetadata,
            VisibilityType.hideSidebar,
            dispatch,
          )
        }
        checked={isVisibilityHideSidebar(qMetadata)}
        value={VisibilityType.hideSidebar}
        label={t("Hide sidebar texts in PDF")}
      />
    </FormField>
  );
};

export default PdfSectionView;
