import React from "react";

import {
  Element,
  Extension,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  ValueSet,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { useTranslation } from "react-i18next";
import "./Question.css";
import removeMd from "remove-markdown";

import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "../../types/IQuestionnareItemType";

import Choice from "./QuestionType/Choice";
import { DateType } from "./QuestionType/DateType";
import Infotext from "./QuestionType/Infotext";
import OptionReference from "./QuestionType/OptionReference";
import UnitTypeSelector from "./UnitType/UnitTypeSelector";
import ValidationAnswerTypes from "./ValidationAnswerTypes/ValidationAnswerTypes";
import { erRenderingOption } from "../../helpers/codeHelper";
import {
  createMarkdownExtension,
  removeItemExtension,
  setItemExtension,
} from "../../helpers/extensionHelper";
import {
  isItemControlInline,
  isItemControlReceiverComponent,
  isItemControlHighlight,
  isRecipientList,
} from "../../helpers/itemControl";
import { getTextExtensionMarkdown } from "../../helpers/QuestionHelper";
import {
  canTypeBeRequired,
  canTypeBeValidated,
  canTypeHaveSublabel,
  getItemDisplayType,
} from "../../helpers/questionTypeFeatures";
import { updateItemAction } from "../../store/treeStore/treeActions";
import { ActionType } from "../../store/treeStore/treeStore";
import { ValidationError } from "../../utils/validationUtils";
import Accordion from "../Accordion/Accordion";
import AdvancedQuestionOptions from "../AdvancedQuestionOptions/AdvancedQuestionOptions";
import Codes from "./Code/Codes";
import EnableWhen from "./EnableWhen/EnableWhen";
import FormField from "../FormField/FormField";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import SwitchBtn from "../SwitchBtn/SwitchBtn";
import QExtensions from "./Extensions/Extensions";
import {
  ErrorClassVariant,
  getSeverityClass,
  getSeverityClasses,
} from "../Validation/validationHelper";
import { ValidationType } from "../Validation/validationTypes";

interface QuestionProps {
  item: QuestionnaireItem;
  formExtensions: Array<Extension> | undefined;
  parentArray: Array<string>;
  containedResources?: Array<ValueSet>;
  conditionalArray: ValueSetComposeIncludeConcept[];
  itemValidationErrors: ValidationError[];
  getItem: (linkId: string) => QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
}

const Question = (props: QuestionProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [isMarkdownActivated, setIsMarkdownActivated] = React.useState<boolean>(
    !!props.item._text,
  );
  const codeElements = props.item.code
    ? `(${props.item.code.filter((value) => !erRenderingOption(value)).length})`
    : "(0)";
  const extensionElements = props.item.extension
    ? `(${props.item.extension.length})`
    : "(0)";
  const dispatchUpdateItem = (
    name: IItemProperty,
    value:
      | string
      | boolean
      | QuestionnaireItemAnswerOption[]
      | Element
      | Extension[]
      | undefined,
  ): void => {
    props.dispatch(updateItemAction(props.item.linkId, name, value));
  };

  const getLabelText = (): string => {
    let labelText = "";
    if (isMarkdownActivated) {
      labelText = getTextExtensionMarkdown(props.item) || "";
    }
    return labelText || props.item.text || "";
  };

  const getSublabelText = (): string => {
    return (
      props.item.extension?.find((x) => x.url === IExtensionType.sublabel)
        ?.valueMarkdown || ""
    );
  };

  const convertToPlaintext = (stringToBeConverted: string): string => {
    let plainText = removeMd(stringToBeConverted);
    plainText = plainText.replaceAll("\\", "");
    plainText = plainText.replaceAll(/([ \n])+/g, " ");
    return plainText;
  };

  const dispatchUpdateMarkdownLabel = (newLabel: string): void => {
    const markdownValue = createMarkdownExtension(newLabel);

    dispatchUpdateItem(IItemProperty._text, markdownValue);
    // update text with same value. Text is used in condition in enableWhen
    dispatchUpdateItem(IItemProperty.text, convertToPlaintext(newLabel));
  };

  const respondType = (): React.JSX.Element => {
    if (isItemControlReceiverComponent(props.item)) {
      return (
        <div>{t("Recipient component is configured in Helsenorge admin")}</div>
      );
    }
    if (
      isItemControlInline(props.item) ||
      isItemControlHighlight(props.item) ||
      props.item.type === IQuestionnaireItemType.display
    ) {
      return <Infotext item={props.item} parentArray={props.parentArray} />;
    }
    if (isRecipientList(props.item)) {
      return <OptionReference item={props.item} />;
    }
    if (
      props.item.type === IQuestionnaireItemType.date ||
      props.item.type === IQuestionnaireItemType.dateTime
    ) {
      return <DateType item={props.item} dispatch={props.dispatch} />;
    }
    if (
      props.item.type === IQuestionnaireItemType.choice ||
      props.item.type === IQuestionnaireItemType.openChoice
    ) {
      return (
        <Choice
          item={props.item}
          itemValidationErrors={props.itemValidationErrors}
        />
      );
    }
    if (props.item.type === IQuestionnaireItemType.quantity) {
      return <UnitTypeSelector item={props.item} />;
    }
    if (
      props.item.type === IQuestionnaireItemType.string ||
      props.item.type === IQuestionnaireItemType.text
    ) {
      return (
        <FormField>
          <SwitchBtn
            label={t("Multi-line textfield")}
            value={props.item.type === IQuestionnaireItemType.text}
            onChange={() => {
              if (props.item.type === IQuestionnaireItemType.text) {
                dispatchUpdateItem(
                  IItemProperty.type,
                  IQuestionnaireItemType.string,
                );
              } else {
                dispatchUpdateItem(
                  IItemProperty.type,
                  IQuestionnaireItemType.text,
                );
              }
            }}
          />
        </FormField>
      );
    }
    return <></>;
  };

  const enableWhenCount =
    props.item.enableWhen && props.item.enableWhen.length > 0
      ? `(${props.item.enableWhen?.length})`
      : "";

  const severityClass = getSeverityClass(
    ErrorClassVariant.highlight,
    props.itemValidationErrors.filter(
      (x) => x.errorProperty === ValidationType.extension,
    ),
  );
  return (
    <div className="question" id={props.item.linkId}>
      <div className="question-form">
        <h2 className="question-type-header">
          {t(getItemDisplayType(props.item))}
        </h2>
        <div className="horizontal">
          <FormField>
            <SwitchBtn
              label={t("Text formatting")}
              value={isMarkdownActivated}
              onChange={() => {
                const newIsMarkdownEnabled = !isMarkdownActivated;
                setIsMarkdownActivated(newIsMarkdownEnabled);
                if (!newIsMarkdownEnabled) {
                  // remove markdown extension
                  dispatchUpdateItem(IItemProperty._text, undefined);
                } else {
                  // set existing text as markdown value
                  dispatchUpdateMarkdownLabel(props.item.text || "");
                }
              }}
            />
          </FormField>
          {canTypeBeRequired(props.item) && (
            <FormField>
              <SwitchBtn
                label={t("Mandatory")}
                value={props.item.required || false}
                onChange={() =>
                  dispatchUpdateItem(
                    IItemProperty.required,
                    !props.item.required,
                  )
                }
              />
            </FormField>
          )}
        </div>
        <FormField label={t("Text")}>
          {isMarkdownActivated ? (
            <MarkdownEditor
              data={getLabelText()}
              onBlur={dispatchUpdateMarkdownLabel}
            />
          ) : (
            <textarea
              defaultValue={getLabelText()}
              onBlur={(e) => {
                dispatchUpdateItem(IItemProperty.text, e.target.value);
              }}
            />
          )}
        </FormField>
        {canTypeHaveSublabel(props.item) && (
          <FormField label={t("Sublabel")} isOptional>
            <MarkdownEditor
              data={getSublabelText()}
              onBlur={(newValue: string) => {
                if (newValue) {
                  const newExtension = {
                    url: IExtensionType.sublabel,
                    valueMarkdown: newValue,
                  };
                  setItemExtension(props.item, newExtension, props.dispatch);
                } else {
                  removeItemExtension(
                    props.item,
                    IExtensionType.sublabel,
                    props.dispatch,
                  );
                }
              }}
            />
          </FormField>
        )}
        {respondType()}
      </div>
      <div className="question-addons">
        {canTypeBeValidated(props.item) && (
          <Accordion title={t("Add validation")}>
            <ValidationAnswerTypes item={props.item} />
          </Accordion>
        )}
        <Accordion title={`${t("Enable when")} ${enableWhenCount}`}>
          <EnableWhen
            getItem={props.getItem}
            conditionalArray={props.conditionalArray}
            linkId={props.item.linkId}
            enableWhen={props.item.enableWhen || []}
            containedResources={props.containedResources}
            itemValidationErrors={props.itemValidationErrors}
          />
        </Accordion>
        <Accordion title={`${t("Code")} ${codeElements}`}>
          <Codes
            linkId={props.item.linkId}
            itemValidationErrors={props.itemValidationErrors}
          />
        </Accordion>
        <div className={severityClass}>
          <Accordion title={`${t("Extension")} ${extensionElements}`}>
            <QExtensions
              linkId={props.item.linkId}
              itemValidationErrors={props.itemValidationErrors}
            />
          </Accordion>
        </div>

        <Accordion title={t("Advanced settings")}>
          <AdvancedQuestionOptions
            item={props.item}
            parentArray={props.parentArray}
            conditionalArray={props.conditionalArray}
            itemValidationErrors={props.itemValidationErrors}
            getItem={props.getItem}
          />
        </Accordion>
      </div>
    </div>
  );
};

export default Question;
