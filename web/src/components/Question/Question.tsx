import React from "react";

import { useTranslation } from "react-i18next";
import { getItemType } from "src/helpers/treeHelper";

import type { ActionType } from "../../store/treeStore/treeStore";
import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "../../types/IQuestionnareItemType";
import type { ValidationError } from "../../utils/validationUtils";
import type {
  Element,
  Extension,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  ValueSet,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";

import "./Question.css";

import { IconSize } from "@helsenorge/designsystem-react";

import useDebounce from "../MarkdownEditor/useDebounce";
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
} from "../../helpers/extensionHelper";
import {
  isItemControlInline,
  isItemControlReceiverComponent,
  isItemControlHighlight,
  isRecipientList,
} from "../../helpers/itemControl";
import { markdownToPlainText } from "../../helpers/markdownToPlainText";
import { getTextExtensionMarkdown } from "../../helpers/QuestionHelper";
import {
  canTypeBeRequired,
  canTypeBeValidated,
  canTypeHaveSublabel,
  getItemDisplayType,
} from "../../helpers/questionTypeFeatures";
import { updateItemAction } from "../../store/treeStore/treeActions";
import Accordion from "../Accordion/Accordion";
import AdvancedQuestionOptions from "../AdvancedQuestionOptions/AdvancedQuestionOptions";
import Codes from "./Code/Codes";
import EnableWhen from "./EnableWhen/EnableWhen";
import { TreeItemIcon } from "../AnchorMenu/TreeView/TreeItemIcon";
import FormField from "../FormField/FormField";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import SwitchBtn from "../SwitchBtn/SwitchBtn";
import QExtensions from "./Extensions/Extensions";
import {
  ErrorClassVariant,
  getSeverityClass,
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
  const itemType = getItemType(props.item);
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

  // Local state for text inputs with debouncing
  const [textValue, setTextValue] = React.useState<string>(() =>
    getLabelText(),
  );
  const [sublabelValue, setSublabelValue] = React.useState<string>(() =>
    getSublabelText(),
  );
  const debouncedTextValue = useDebounce(textValue, 300);
  const debouncedSublabelValue = useDebounce(sublabelValue, 300);

  // Track whether there is a pending (unflushed) change
  const pendingTextRef = React.useRef<string | null>(null);
  const pendingSublabelRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    pendingTextRef.current = textValue !== getLabelText() ? textValue : null;
  }, [textValue]);

  React.useEffect(() => {
    pendingSublabelRef.current =
      sublabelValue !== getSublabelText() ? sublabelValue : null;
  }, [sublabelValue]);

  // Sync local state when item changes
  React.useEffect(() => {
    setTextValue(getLabelText());
    setSublabelValue(getSublabelText());
  }, [props.item.linkId]);

  // Save debounced text changes
  React.useEffect(() => {
    if (debouncedTextValue !== getLabelText()) {
      dispatchUpdateItem(IItemProperty.text, debouncedTextValue);
      pendingTextRef.current = null;
    }
  }, [debouncedTextValue]);

  const convertToPlaintext = (stringToBeConverted: string): string => {
    return markdownToPlainText(stringToBeConverted);
  };

  const dispatchUpdateMarkdownLabel = (
    newLabel: string,
    plainText?: string,
  ): void => {
    const markdownValue = createMarkdownExtension(newLabel);

    dispatchUpdateItem(IItemProperty._text, markdownValue);
    // update text with same value. Text is used in condition in enableWhen
    dispatchUpdateItem(
      IItemProperty.text,
      plainText || convertToPlaintext(newLabel),
    );
  };

  const dispatchUpdateSublabel = (value: string, plainText?: string): void => {
    if (value) {
      const extensionsToSet = (props.item.extension || []).filter(
        (x: Extension) =>
          x.url !== IExtensionType.sublabel &&
          x.url !== IExtensionType.sublabelString,
      );
      extensionsToSet.push({
        url: IExtensionType.sublabel,
        valueMarkdown: value,
      });
      extensionsToSet.push({
        url: IExtensionType.sublabelString,
        valueString: plainText || convertToPlaintext(value),
      });
      props.dispatch(
        updateItemAction(
          props.item.linkId,
          IItemProperty.extension,
          extensionsToSet,
        ),
      );
    } else {
      removeItemExtension(
        props.item,
        [IExtensionType.sublabel, IExtensionType.sublabelString],
        props.dispatch,
      );
    }
  };

  // Flush pending values on unmount or when switching to a different item
  const dispatchRef = React.useRef(props.dispatch);
  const linkIdRef = React.useRef(props.item.linkId);
  const dispatchUpdateSublabelRef = React.useRef(dispatchUpdateSublabel);

  React.useEffect(() => {
    dispatchRef.current = props.dispatch;
    linkIdRef.current = props.item.linkId;
    dispatchUpdateSublabelRef.current = dispatchUpdateSublabel;
  });

  React.useEffect(() => {
    return (): void => {
      if (pendingTextRef.current !== null) {
        dispatchRef.current(
          updateItemAction(
            linkIdRef.current,
            IItemProperty.text,
            pendingTextRef.current,
          ),
        );
        pendingTextRef.current = null;
      }
      if (pendingSublabelRef.current !== null) {
        dispatchUpdateSublabelRef.current(pendingSublabelRef.current);
        pendingSublabelRef.current = null;
      }
    };
  }, [props.item.linkId]);

  // Save debounced sublabel changes (plain text textarea path)
  React.useEffect(() => {
    const currentSublabel = getSublabelText();
    if (debouncedSublabelValue !== currentSublabel) {
      dispatchUpdateSublabel(debouncedSublabelValue);
      pendingSublabelRef.current = null;
    }
  }, [debouncedSublabelValue]);

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
          <TreeItemIcon type={itemType} size={IconSize.XSmall} />
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
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={(e) => {
                dispatchUpdateItem(IItemProperty.text, e.target.value);
              }}
            />
          )}
        </FormField>
        {canTypeHaveSublabel(props.item) && (
          <FormField label={t("Sublabel")} isOptional>
            {isMarkdownActivated ? (
              <MarkdownEditor
                data={getSublabelText()}
                onBlur={(newValue: string, plainText?: string) => {
                  dispatchUpdateSublabel(newValue, plainText);
                }}
              />
            ) : (
              <textarea
                value={sublabelValue}
                onChange={(e) => setSublabelValue(e.target.value)}
                onBlur={(e) => {
                  dispatchUpdateSublabel(e.target.value);
                }}
              />
            )}
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
