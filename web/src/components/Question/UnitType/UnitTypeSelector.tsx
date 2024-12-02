import React, { ChangeEvent, useContext } from "react";

import {
  Coding,
  Extension,
  Quantity,
  QuestionnaireItem,
  QuestionnaireItemInitial,
} from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IExtensionType,
  IItemProperty,
} from "../../../types/IQuestionnareItemType";

import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import {
  QUANTITY_UNIT_TYPE_CUSTOM,
  QUANTITY_UNIT_TYPE_NOT_SELECTED,
  quantityUnitTypes,
} from "../../../helpers/QuestionHelper";
import { createUriUUID } from "../../../helpers/uriHelper";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";
import InputField from "../../InputField/inputField";
import Select from "../../Select/Select";

type UnitTypeSelectorProps = {
  item: QuestionnaireItem;
};

const UnitTypeSelector = (props: UnitTypeSelectorProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const getTranslatedQuantityUnitType = (code: string): Coding | undefined => {
    const type = quantityUnitTypes.find(
      ({ code: predefinedCode }) => predefinedCode === code
    );
    if (type) {
      return { code: type.code, display: t(type.display), system: type.system };
    }
    return type;
  };

  const updateQuantityUnitType = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    const {
      target: { value: quantityUnitTypeCode },
    } = event;
    if (quantityUnitTypeCode === QUANTITY_UNIT_TYPE_NOT_SELECTED) {
      removeItemExtension(
        props.item,
        IExtensionType.questionnaireUnit,
        dispatch
      );
    } else {
      const coding =
        quantityUnitTypeCode === QUANTITY_UNIT_TYPE_CUSTOM
          ? ({ code: "", display: "", system: createUriUUID() } as Coding)
          : getTranslatedQuantityUnitType(quantityUnitTypeCode);
      const unitExtension: Extension = {
        url: IExtensionType.questionnaireUnit,
        valueCoding: coding,
      };
      setItemExtension(props.item, unitExtension, dispatch);
      updateInitialValue(coding);
    }
  };

  const getCurrentQuantityUnitTypeCoding = (): Coding | undefined => {
    return props.item.extension?.find((extension) => {
      return extension.url === IExtensionType.questionnaireUnit;
    })?.valueCoding;
  };

  const updateCustomQuantityUnitType = (
    property: "code" | "display" | "system",
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    const currentValueCoding = getCurrentQuantityUnitTypeCoding();
    let newValueCoding: Coding;
    if (currentValueCoding) {
      newValueCoding = {
        ...currentValueCoding,
        [property]: event.target.value,
      };
    } else {
      newValueCoding = { [property]: event.target.value };
    }
    const unitExtension: Extension = {
      url: IExtensionType.questionnaireUnit,
      valueCoding: newValueCoding,
    };
    setItemExtension(props.item, unitExtension, dispatch);
  };

  const updateInitialValue = (newValueCoding: Coding | undefined): void => {
    if (props.item.initial && newValueCoding) {
      const initial = props.item.initial;
      if (initial) {
        const newInitial: QuestionnaireItemInitial[] = [];
        initial.forEach((m: QuestionnaireItemInitial) => {
          const valueQuantity = m.valueQuantity;
          if (valueQuantity) {
            newInitial.push({
              valueQuantity: {
                unit: newValueCoding.display,
                code: newValueCoding.code,
                system: newValueCoding.system,
                value: valueQuantity.value,
              } as Quantity,
            } as QuestionnaireItemInitial);
          }
        });
        dispatch(
          updateItemAction(props.item.linkId, IItemProperty.initial, newInitial)
        );
      }
    }
  };

  const getQuantityUnitType = (): string => {
    const quantityUnitTypeCoding = getCurrentQuantityUnitTypeCoding();

    if (!quantityUnitTypeCoding) {
      return QUANTITY_UNIT_TYPE_NOT_SELECTED;
    }

    const {
      code: currentCode = "",
      display: currentDisplay = "",
      system: currentSystem = "",
    } = quantityUnitTypeCoding;

    const isPredefined = quantityUnitTypes.some(
      (type) =>
        type.code !== QUANTITY_UNIT_TYPE_CUSTOM &&
        type.code === currentCode &&
        t(type.display) === currentDisplay &&
        type.system === currentSystem
    );

    if (isPredefined) {
      return currentCode;
    }

    return QUANTITY_UNIT_TYPE_CUSTOM;
  };

  const selectedUnitType = getQuantityUnitType();
  const isCustom = selectedUnitType === QUANTITY_UNIT_TYPE_CUSTOM;
  const currentCoding = getCurrentQuantityUnitTypeCoding();
  const { code, display, system } = currentCoding
    ? currentCoding
    : { code: "", display: "", system: "" };

  return (
    <>
      <FormField label={t("Select unit")}>
        <Select
          options={quantityUnitTypes}
          onChange={updateQuantityUnitType}
          value={selectedUnitType}
        />
      </FormField>
      {isCustom && (
        <>
          <div className="horizontal equal">
            <FormField label={t("Display")}>
              <InputField
                defaultValue={display}
                onBlur={(event) =>
                  updateCustomQuantityUnitType("display", event)
                }
              />
            </FormField>
            <FormField label={t("Code")}>
              <InputField
                defaultValue={code}
                onBlur={(event) => updateCustomQuantityUnitType("code", event)}
              />
            </FormField>
          </div>
          <div className="horizontal full">
            <FormField label={t("System")}>
              <UriField
                value={system}
                onBlur={(event) =>
                  updateCustomQuantityUnitType("system", event)
                }
              />
            </FormField>
          </div>
        </>
      )}
    </>
  );
};

export default UnitTypeSelector;
