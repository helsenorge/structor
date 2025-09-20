import React, { useContext, useEffect, useState } from "react";

import {
  QuestionnaireItem,
  ValueSetComposeIncludeConcept,
  Extension,
  QuestionnaireItemEnableWhen,
} from "fhir/r4";
import { useTranslation } from "react-i18next";
import { getSeverityClass } from "src/components/Validation/validationHelper";
import { ValidationType } from "src/components/Validation/validationTypes";
import { ValidationError } from "src/utils/validationUtils";

import {
  IItemProperty,
  IExtensionType,
  IOperator,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { getLinkIdFromValueString } from "../../../helpers/dataReceiverHelper";
import {
  setItemExtension,
  removeItemExtension,
  getExtensionStringValue,
  getQuantityCode,
} from "../../../helpers/extensionHelper";
import {
  ItemControlType,
  setItemControlExtension,
} from "../../../helpers/itemControl";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import Select from "../../Select/Select";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type CopyFromOptionProps = {
  item: QuestionnaireItem;
  conditionalArray: ValueSetComposeIncludeConcept[];
  isDataReceiver: boolean;
  canTypeBeReadonly: boolean;
  errors: ValidationError[];
  dataReceiverStateChanger: React.Dispatch<React.SetStateAction<boolean>>;
  getItem: (linkId: string) => QuestionnaireItem;
};

const CopyFromOption = (props: CopyFromOptionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const getSelectedValue = (): ValueSetComposeIncludeConcept | undefined =>
    props.conditionalArray.find(
      (f) => f.code === getLinkIdFromValueString(props.item),
    );
  const [selectedValue, setSelectedvalue] = useState(
    getSelectedValue()?.code ?? undefined,
  );

  const filterWithRepeats = (value: ValueSetComposeIncludeConcept): boolean => {
    const item = props.getItem(value.code);
    const hasTypeAndRepeats =
      item.type === props.item.type && item.repeats === props.item.repeats;
    if (props.item.type === IQuestionnaireItemType.quantity) {
      if (item.extension && props.item.extension) {
        return (
          hasTypeAndRepeats &&
          getQuantityCode(item.extension) ===
            getQuantityCode(props.item.extension)
        );
      }
    }
    return hasTypeAndRepeats;
  };

  const questionsOptions = (): ValueSetComposeIncludeConcept[] => {
    return props.conditionalArray.filter((f) => filterWithRepeats(f));
  };

  const updateReadonlyItem = (value: boolean): void => {
    if (props.canTypeBeReadonly) {
      dispatch(
        updateItemAction(props.item.linkId, IItemProperty.readOnly, value),
      );
    }
  };

  const updateEnableWhen = (selectedValue: string | undefined): void => {
    if (selectedValue) {
      const initEnableWhen: QuestionnaireItemEnableWhen[] = [];
      const operator =
        props.item.type === IQuestionnaireItemType.boolean
          ? "="
          : IOperator.exists;
      const enableWhen =
        props.item.enableWhen?.filter(
          (ew: QuestionnaireItemEnableWhen) => ew.operator !== operator,
        ) || initEnableWhen;
      enableWhen.push({
        answerBoolean: true,
        question: selectedValue,
        operator: operator,
      } as QuestionnaireItemEnableWhen);
      dispatch(
        updateItemAction(
          props.item.linkId,
          IItemProperty.enableWhen,
          enableWhen,
        ),
      );
    }
  };

  const setCalculationExpression = (code: string | undefined): void => {
    if (code) {
      const calculatedExpression =
        getExtensionStringValue(
          props.getItem(code),
          IExtensionType.calculatedExpression,
        ) ?? "";
      if (calculatedExpression) {
        const ceExtension: Extension = {
          url: IExtensionType.calculatedExpression,
          valueString: calculatedExpression,
        };
        setItemExtension(props.item, ceExtension, dispatch);
      } else {
        removeItemExtension(
          props.item,
          IExtensionType.calculatedExpression,
          dispatch,
        );
      }
    }
  };

  const setDataReceiverExtenssion = (code: string): void => {
    const extension: Extension = {
      url: IExtensionType.copyExpression,
      valueString: `QuestionnaireResponse.descendants().where(linkId='${code}').answer.value`,
    };
    setItemExtension(props.item, extension, dispatch);
  };

  useEffect(() => {
    if (!props.isDataReceiver) {
      removeItemExtension(props.item, IExtensionType.copyExpression, dispatch);
      setSelectedvalue(undefined);
    } else {
      updateReadonlyItem(props.isDataReceiver);
    }
  }, [props.isDataReceiver]);

  useEffect(() => {
    setCalculationExpression(selectedValue);
    updateEnableWhen(selectedValue);
  }, [selectedValue]);

  const onChangeSwitchBtn = async (): Promise<void> => {
    setItemControlExtension(props.item, ItemControlType.dataReceiver, dispatch);
    props.dataReceiverStateChanger(!props.isDataReceiver);
  };

  const onChangeSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const code = event.target.value;
    setSelectedvalue(code);
    setDataReceiverExtenssion(code);
  };
  const dataReceiverErrorClasses = getSeverityClass(
    "box",
    props.errors.filter(
      (error) =>
        error.errorProperty === ValidationType.dataReceiver &&
        props.item.linkId === error.linkId,
    ),
  );
  return (
    <>
      <div className={dataReceiverErrorClasses}>
        <div className="horizontal equal">
          <FormField>
            <SwitchBtn
              onChange={onChangeSwitchBtn}
              value={props.isDataReceiver}
              label={t("Retrieve input data from field")}
            />
          </FormField>
          {props.isDataReceiver && (
            <FormField label={t("Select earlier question:")}>
              <Select
                placeholder={t("Choose question:")}
                options={questionsOptions()}
                value={selectedValue}
                onChange={(event) => onChangeSelect(event)}
              />
            </FormField>
          )}
        </div>
      </div>
    </>
  );
};

export default CopyFromOption;
