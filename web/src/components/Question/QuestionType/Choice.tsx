import React, { useContext } from "react";

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getValueSetsFromState } from "src/store/treeStore/selectors";

import {
  ICodeSystem,
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import ChoiceTypeSelect from "./ChoiceTypeSelect";
import PredefinedValueSets from "./PredefinedValueSets";
import { SliderLabels } from "./SliderLabels";
import { SliderMinMaxLabels } from "./SliderMinMaxLabels";
import {
  addEmptyOptionToAnswerOptionArray,
  createNewAnswerOption,
  updateAnswerOptionSystem,
} from "../../../helpers/answerOptionHelper";
import {
  addItemCode,
  removeItemCode,
  SliderLabelEnum,
} from "../../../helpers/codeHelper";
import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import {
  checkboxExtension,
  dropdownExtension,
  isItemControlCheckbox,
  isItemControlDropDown,
  isItemControlRadioButton,
  isItemControlSlider,
  itemControlExistsInExtensionList,
  ItemControlType,
  radiobuttonExtension,
  sliderExtension,
} from "../../../helpers/itemControl";
import { createUriUUID } from "../../../helpers/uriHelper";
import {
  removeItemAttributeAction,
  updateItemAction,
} from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { ValidationError } from "../../../utils/validationUtils";
import DraggableAnswerOptions from "../../AnswerOption/DraggableAnswerOptions";
import Btn from "../../Btn/Btn";
import { BTN_TYPES, BTN_VARIANTS } from "../../Btn/types";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type Props = {
  item: QuestionnaireItem;
  itemValidationErrors: ValidationError[];
};

const Choice = ({ item, itemValidationErrors }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch, state } = useContext(TreeContext);
  const valueSets = getValueSetsFromState(state);
  const isSlider = itemControlExistsInExtensionList(
    item.extension,
    ItemControlType.slider,
  );

  const dispatchExtentionUpdate = (type: ItemControlType): void => {
    removeItemExtension(item, IExtensionType.itemControl, dispatch);
    removeItemCode(item, ICodeSystem.sliderDisplayType, dispatch);
    removeItemCode(item, ICodeSystem.sliderLabels, dispatch);
    if (type === ItemControlType.checkbox && !isItemControlCheckbox(item)) {
      setItemExtension(item, checkboxExtension, dispatch);
    } else if (
      type === ItemControlType.dropdown &&
      !isItemControlDropDown(item)
    ) {
      setItemExtension(item, dropdownExtension, dispatch);
    } else if (
      type === ItemControlType.radioButton &&
      !isItemControlRadioButton(item)
    ) {
      setItemExtension(item, radiobuttonExtension, dispatch);
    } else if (type === ItemControlType.slider && !isItemControlSlider(item)) {
      setItemExtension(item, sliderExtension, dispatch);
      addItemCode(
        item,
        {
          code: "label",
          display: t("Display value"),
          system: ICodeSystem.sliderDisplayType,
        },
        dispatch,
      );
      addItemCode(
        item,
        {
          code: SliderLabelEnum.LabelLeft,
          display: "",
          system: ICodeSystem.sliderLabels,
        },
        dispatch,
      );
      addItemCode(
        item,
        {
          code: SliderLabelEnum.LabelRight,
          display: "",
          system: ICodeSystem.sliderLabels,
        },
        dispatch,
      );
    }
  };
  const dispatchUpdateItem = (
    name: IItemProperty,
    value:
      | string
      | boolean
      | QuestionnaireItemAnswerOption[]
      | Element
      | undefined,
  ): void => {
    dispatch(updateItemAction(item.linkId, name, value));
  };

  const dispatchRemoveAttribute = (name: IItemProperty): void => {
    dispatch(removeItemAttributeAction(item.linkId, name));
  };

  const handleChangeSystem = (system: string): void => {
    const alteredAnswerOption = updateAnswerOptionSystem(
      item.answerOption || [],
      system,
    );
    dispatchUpdateItem(IItemProperty.answerOption, alteredAnswerOption);
  };

  const getSystem = (): string => {
    if (item.answerOption && item.answerOption.length > 0) {
      return item.answerOption[0]?.valueCoding?.system || "";
    }
    return "";
  };

  const hasValidationError = (): boolean => {
    return itemValidationErrors.some(
      (x) => x.errorProperty === "system" && x.linkId === item.linkId,
    );
  };

  return (
    <>
      <ChoiceTypeSelect
        item={item}
        dispatchExtentionUpdate={dispatchExtentionUpdate}
      />
      {isSlider && (
        <>
          <SliderLabels item={item} />
          <SliderMinMaxLabels item={item} />
        </>
      )}
      <>
        <FormField>
          <SwitchBtn
            disabled={isSlider}
            onChange={() => {
              const newType =
                item.type === IQuestionnaireItemType.openChoice
                  ? IQuestionnaireItemType.choice
                  : IQuestionnaireItemType.openChoice;
              dispatchUpdateItem(IItemProperty.type, newType);
            }}
            value={item.type === IQuestionnaireItemType.openChoice}
            label={t("Allow free-text answer")}
          />
        </FormField>
        <FormField>
          <SwitchBtn
            onChange={() => {
              if (item.answerValueSet) {
                const system = createUriUUID();
                dispatchRemoveAttribute(IItemProperty.answerValueSet);
                dispatchUpdateItem(IItemProperty.answerOption, [
                  createNewAnswerOption(system),
                  createNewAnswerOption(system),
                ]);
              } else {
                dispatchRemoveAttribute(IItemProperty.answerOption);
                dispatchUpdateItem(IItemProperty.answerValueSet, "#");
              }
            }}
            value={!!item.answerValueSet}
            label={t("Use predefined valueset")}
          />
        </FormField>
      </>
      {item.answerValueSet ? (
        <PredefinedValueSets
          item={item}
          qContained={valueSets}
          dispatchUpdateItem={dispatchUpdateItem}
        />
      ) : (
        <>
          <div
            key={`${getSystem()}`}
            className={`code-section ${
              hasValidationError() ? "validation-error" : ""
            }`}
          >
            <FormField label={t("System")}>
              <UriField
                value={getSystem()}
                onBlur={(event) => handleChangeSystem(event.target.value)}
              />
            </FormField>
          </div>
          <FormField>
            {item.answerOption && item.answerOption?.length > 0 && (
              <DraggableAnswerOptions
                item={item}
                dispatchUpdateItem={dispatchUpdateItem}
              />
            )}
          </FormField>
          <div className="center-text">
            <Btn
              title={t("+ Add option")}
              type={BTN_TYPES.Button}
              onClick={() => {
                const newArray = addEmptyOptionToAnswerOptionArray(
                  item.answerOption || [],
                );
                dispatchUpdateItem(IItemProperty.answerOption, newArray);
              }}
              variant={BTN_VARIANTS.Secondary}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Choice;
