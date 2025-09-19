import React, { useContext } from "react";

import { Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
  IValueSetSystem,
} from "../../types/IQuestionnareItemType";

import { createMarkdownExtension } from "../../helpers/extensionHelper";
import { ItemControlType } from "../../helpers/itemControl";
import { getTextExtensionMarkdown } from "../../helpers/QuestionHelper";
import {
  deleteItemAction,
  newItemSidebar,
  updateItemAction,
} from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";
import { ValidationError } from "../../utils/validationUtils";
import Accordion from "../Accordion/Accordion";
import Btn from "../Btn/Btn";
import FormField from "../FormField/FormField";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import Select from "../Select/Select";

interface SidebarProps {
  questionnaireDetailsErrors: ValidationError[];
}

const Sidebar = (props: SidebarProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);

  const dispatchNewSidebar = (): void => {
    dispatch(newItemSidebar([]));
  };

  const removeSidebar = (linkId: string): void => {
    dispatch(deleteItemAction(linkId, []));
  };

  const sidebarItems = state.qOrder.filter(
    (x) =>
      state.qItems[x.linkId].type === IQuestionnaireItemType.text &&
      state.qItems[x.linkId].extension
        ?.find((ex) => ex.url === IExtensionType.itemControl)
        ?.valueCodeableConcept?.coding?.find(
          (y) => y.code === ItemControlType.sidebar,
        ),
  );

  const hasValidationError = (linkId: string): boolean => {
    return (
      !getMarkdown(linkId) &&
      props.questionnaireDetailsErrors.some((error) => error.linkId === linkId)
    );
  };

  const findCurrentCode = (linkId: string): Coding | undefined => {
    return state.qItems[linkId].code?.find(
      (x) => x.system === IValueSetSystem.sotHeader,
    );
  };

  const handleChangeCode = (code: string, linkId: string): void => {
    const currentCode = findCurrentCode(linkId);
    const newCode = [{ ...currentCode, display: code, code }] as Coding[];
    dispatch(updateItemAction(linkId, IItemProperty.code, newCode));
  };

  const handleMarkdown = (linkId: string, value: string): void => {
    const newValue = createMarkdownExtension(value);
    dispatch(updateItemAction(linkId, IItemProperty._text, newValue));
  };

  const getMarkdown = (linkId: string): string => {
    return getTextExtensionMarkdown(state.qItems[linkId]) ?? "";
  };

  return (
    <Accordion title={t("Sidebar")}>
      {sidebarItems.map((x) => {
        return (
          <div key={x.linkId}>
            <FormField label={t("Sidebar heading")}>
              <Select
                placeholder={t("select sidebar heading:")}
                options={[
                  {
                    code: "SOT-1",
                    display: t("Options regarding completion (SOT-1)"),
                  },
                  {
                    code: "SOT-2",
                    display: t("Guidance and person responsible (SOT-2)"),
                  },
                  {
                    code: "SOT-3",
                    display: t("Processing by the recipient (SOT-3)"),
                  },
                ]}
                value={findCurrentCode(x.linkId)?.code}
                onChange={(event) =>
                  handleChangeCode(event.target.value, x.linkId)
                }
              />
            </FormField>
            <FormField label={t("Content")}>
              <div
                className={
                  hasValidationError(x.linkId) ? "error-highlight" : ""
                }
              >
                <MarkdownEditor
                  data={getMarkdown(x.linkId)}
                  onBlur={(markdown) => handleMarkdown(x.linkId, markdown)}
                />
              </div>
            </FormField>
            <div className="center-text">
              <Btn
                title={t("- Remove element")}
                type="button"
                variant="secondary"
                onClick={() => removeSidebar(x.linkId)}
              />
            </div>
            <hr style={{ margin: "24px 0px" }} />
          </div>
        );
      })}
      <div className="center-text">
        <Btn
          title={t("+ Add element")}
          type="button"
          variant="primary"
          onClick={dispatchNewSidebar}
        />
      </div>
    </Accordion>
  );
};

export default Sidebar;
