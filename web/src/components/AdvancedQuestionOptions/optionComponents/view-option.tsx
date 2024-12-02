import React, { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  ICodeSystem,
  IExtensionType,
} from "../../../types/IQuestionnareItemType";

import {
  renderingOptions,
  removeItemCode,
  addRenderOptionItemCode,
  RenderingOptionsEnum,
  choiceRenderOptions,
  ChoiceRenderOptionCodes,
  addChoiceRenderOptionItemCode,
} from "../../../helpers/codeHelper";
import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import { canTypeHaveChoiceRender } from "../../../helpers/questionTypeFeatures";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import RadioBtn from "../../RadioBtn/RadioBtn";

type ViewOptionProps = {
  item: QuestionnaireItem;
};

const ViewOption = ({ item }: ViewOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const checkedRenderOptions = (): string => {
    return item.extension?.find((ex) => ex.url === IExtensionType.hidden)
      ?.valueBoolean
      ? RenderingOptionsEnum.Hidden
      : item.code?.find(
          (code) => code.system === ICodeSystem.renderOptionsCodeSystem
        )?.code ?? RenderingOptionsEnum.None;
  };
  const onChangeRenderOptions = (newValue: string): void => {
    removeItemExtension(item, IExtensionType.hidden, dispatch);
    removeItemCode(item, ICodeSystem.renderOptionsCodeSystem, dispatch);
    switch (newValue) {
      case RenderingOptionsEnum.Hidden:
        setItemExtension(
          item,
          {
            url: IExtensionType.hidden,
            valueBoolean: true,
          },
          dispatch
        );
        break;
      default:
        addRenderOptionItemCode(item, newValue, dispatch);
        break;
    }
  };

  const checkedChoiceRenderOptions = (): string | undefined => {
    const choiceRendering = item.code?.find(
      (code) => code.system === ICodeSystem.choiceRenderOptions
    );
    return choiceRendering === undefined
      ? ChoiceRenderOptionCodes.Default
      : choiceRendering.code;
  };
  const onChangeChoiceRenderOptions = (newValue: string): void => {
    removeItemCode(item, ICodeSystem.choiceRenderOptions, dispatch);
    addChoiceRenderOptionItemCode(item, newValue, t, dispatch);
  };

  return (
    <FormField label={t("View")}>
      <FormField
        sublabel={t("Choose if/where the component should be displayed")}
      >
        <RadioBtn
          onChange={onChangeRenderOptions}
          checked={checkedRenderOptions()}
          options={renderingOptions}
          name={"elementView-radio"}
        />
      </FormField>
      {canTypeHaveChoiceRender(item) && (
        <FormField
          sublabel={t(
            "Choose whether all answer options should be displayed in PDF"
          )}
        >
          <RadioBtn
            onChange={onChangeChoiceRenderOptions}
            checked={checkedChoiceRenderOptions()}
            options={choiceRenderOptions(t)}
            name={"elementChoiceView-radio"}
          />
        </FormField>
      )}
    </FormField>
  );
};

export default ViewOption;
