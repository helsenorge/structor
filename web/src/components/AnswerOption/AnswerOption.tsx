import React, { useState, useEffect, ChangeEvent } from "react";

import { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";

import "./AnswerOption.css";
import { IExtensionType } from "../../types/IQuestionnareItemType";

import { findExtensionInExtensionArray } from "../../helpers/extensionHelper";
import { ItemControlType } from "../../helpers/itemControl";
import { doesItemHaveCode } from "../../utils/itemSearchUtils";
import InputField from "../InputField/inputField";

type Props = {
  item: QuestionnaireItem;
  answerOption?: QuestionnaireItemAnswerOption;
  handleDrag?: DraggableProvidedDragHandleProps;
  changeDisplay: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeOrdinalValueExtension: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  changeValueSetLabel: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
      (cd) => cd.code === ItemControlType.slider
    )
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
        IExtensionType.ordinalValue
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
        IExtensionType.valueSetLabel
      );
    if (scoreExtension) {
      stringToReturn = scoreExtension?.valueString?.toString() || "";
    }
    return stringToReturn;
  };

  useEffect(() => {
    setDisplayScoringField(doesItemHaveCode(item, "score"));
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
          onBlur={(event) =>
            changeDisplay(event, answerOption?.valueCoding?.display)
          }
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
        <button
          type="button"
          name={t("Remove element")}
          onClick={deleteItem}
          className="align-everything"
        />
      )}
    </div>
  );
};

export default AnswerOption;
