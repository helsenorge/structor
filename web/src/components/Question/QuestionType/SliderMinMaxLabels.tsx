import { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  ICodeSystem,
  ICodingProperty,
} from "../../../types/IQuestionnareItemType";

import { SliderLabelEnum } from "../../../helpers/codeHelper";
import { updateItemCodePropertyWithCodeAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

type Props = {
  item: QuestionnaireItem;
};

export const SliderMinMaxLabels = ({ item }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const leftLabel = item.code?.find(
    (cd) =>
      cd.system === ICodeSystem.sliderLabels &&
      cd.code === SliderLabelEnum.LabelLeft
  );
  const rightLabel = item.code?.find(
    (cd) =>
      cd.system === ICodeSystem.sliderLabels &&
      cd.code === SliderLabelEnum.LabelRight
  );

  const handleSetMaxLabel = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    dispatch(
      updateItemCodePropertyWithCodeAction(
        item.linkId,
        ICodingProperty.display,
        event.target.value,
        ICodeSystem.sliderLabels,
        SliderLabelEnum.LabelRight
      )
    );
  };
  const handleSetMinLabel = (
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    dispatch(
      updateItemCodePropertyWithCodeAction(
        item.linkId,
        ICodingProperty.display,
        event.target.value,
        ICodeSystem.sliderLabels,
        SliderLabelEnum.LabelLeft
      )
    );
  };

  return (
    <div>
      <FormField label={t("Min label")}>
        <InputField
          name="slider-min-label"
          onBlur={handleSetMinLabel}
          placeholder={t("Enter a displayvalue for min..")}
          defaultValue={leftLabel?.display}
        />
      </FormField>
      <FormField label={t("Maks label")}>
        <InputField
          name="slider-max-label"
          onBlur={handleSetMaxLabel}
          placeholder={t("Enter a displayvalue for max..")}
          defaultValue={rightLabel?.display}
        />
      </FormField>
    </div>
  );
};
