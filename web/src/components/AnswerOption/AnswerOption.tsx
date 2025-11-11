import React, { useState, useEffect, ChangeEvent } from "react";

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";

import "./AnswerOption.css";
import { IExtensionType } from "../../types/IQuestionnareItemType";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import { findExtensionInExtensionArray } from "../../helpers/extensionHelper";
import { ItemControlType } from "../../helpers/itemControl";
import { doesItemHaveCode } from "../../utils/itemSearchUtils";
import InputField from "../InputField/inputField";

type Props = {
  item: QuestionnaireItem;
  answerOption?: QuestionnaireItemAnswerOption;
  handleDrag?: DraggableProvidedDragHandleProps;
  changeDisplay: (event: ChangeEvent<HTMLInputElement>) => void;
  changeCode: (event: ChangeEvent<HTMLInputElement>) => void;
  changeOrdinalValueExtension: (event: ChangeEvent<HTMLInputElement>) => void;
  changeValueSetLabel: (event: ChangeEvent<HTMLInputElement>) => void;
  deleteItem?: () => void;
  showDelete?: boolean;
  disabled?: boolean;
};

const AnswerOption = ({
  item,
  answerOption,
  handleDrag,
  changeDisplay,
  changeCode,
  changeOrdinalValueExtension,
  changeValueSetLabel,
  deleteItem,
  showDelete,
  disabled,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const [displayScoringField, setDisplayScoringField] = useState(false);
  const isSlider = item.extension?.some((ex) =>
    ex.valueCodeableConcept?.coding?.some(
      (cd) => cd.code === ItemControlType.slider,
    ),
  );

  let inputFieldClassName;
  if (displayScoringField && !isSlider) {
    inputFieldClassName = "three-columns";
  } else {
    inputFieldClassName = "two-columns";
  }

  let ordinalValuePlaceholder;
  if (displayScoringField) {
    ordinalValuePlaceholder = isSlider
      ? t("Enter a scoring value as decimal..")
      : t("Enter a scoring decimal..");
  } else {
    ordinalValuePlaceholder = isSlider ? t("Enter a decimal..") : "";
  }

  const getDefaultOrdinalValue = (): string => {
    let stringToReturn = "";
    const scoreExtension =
      answerOption?.valueCoding?.extension &&
      findExtensionInExtensionArray(
        answerOption?.valueCoding?.extension,
        IExtensionType.ordinalValue,
      );
    if (scoreExtension) {
      stringToReturn = scoreExtension?.valueDecimal?.toString() || "";
    }
    return stringToReturn;
  };

  const getDefaultValueSetLabel = (): string => {
    let stringToReturn = "";
    const scoreExtension =
      answerOption?.valueCoding?.extension &&
      findExtensionInExtensionArray(
        answerOption?.valueCoding?.extension,
        IExtensionType.valueSetLabel,
      );
    if (scoreExtension) {
      stringToReturn = scoreExtension?.valueString?.toString() || "";
    }
    return stringToReturn;
  };

  useEffect(() => {
    setDisplayScoringField(doesItemHaveCode(item, ItemControlType.score));
  }, [item]);

  return (
    <div className="answer-option-item align-everything">
      {!disabled && (
        <span
          {...handleDrag}
          className="reorder-icon"
          aria-label="reorder element"
        />
      )}
      <div className="answer-option-content">
        <InputField
          name="beskrivelse"
          className={inputFieldClassName}
          onBlur={(event) => changeDisplay(event)}
          defaultValue={answerOption?.valueCoding?.display}
          disabled={disabled}
          placeholder={t("Enter a title..")}
        />
        <InputField
          key={answerOption?.valueCoding?.code} // set key to update defaultValue when display field is blurred
          name="verdi"
          className={inputFieldClassName}
          defaultValue={answerOption?.valueCoding?.code}
          placeholder={t("Enter a value..")}
          onBlur={(event) => changeCode(event)}
        />
        {(displayScoringField || isSlider) && (
          <InputField
            name="skåring"
            className={inputFieldClassName}
            defaultValue={getDefaultOrdinalValue()}
            placeholder={ordinalValuePlaceholder}
            onChange={(event) => {
              changeOrdinalValueExtension(event);
            }}
          />
        )}
        {isSlider && (
          <>
            <InputField
              name="emojicode"
              className={inputFieldClassName}
              defaultValue={getDefaultValueSetLabel()}
              placeholder={t("Enter an emoji..")}
              onChange={(event) => changeValueSetLabel(event)}
            />
          </>
        )}
      </div>
      {showDelete && (
        <Button
          name={t("Remove element")}
          ariaLabel={t("Remove element")}
          onClick={deleteItem}
          className="answer-option-item-remove"
          variant="borderless"
          size="medium"
        >
          <Icon color="red" svgIcon={TrashCan} />
        </Button>
      )}
    </div>
  );
};

export default AnswerOption;
