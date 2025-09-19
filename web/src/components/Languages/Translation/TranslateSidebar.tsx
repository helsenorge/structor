import React from "react";

import { useTranslation } from "react-i18next";

import { isItemControlSidebar } from "../../../helpers/itemControl";
import { updateSidebarTranslationAction } from "../../../store/treeStore/treeActions";
import {
  ActionType,
  Items,
  Languages,
} from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import MarkdownEditor from "../../MarkdownEditor/MarkdownEditor";

type TranslateSidebarProps = {
  targetLanguage: string;
  translations: Languages;
  items: Items;
  dispatch: React.Dispatch<ActionType>;
};

const TranslateSidebar = ({
  targetLanguage,
  translations,
  items,
  dispatch,
}: TranslateSidebarProps): React.JSX.Element | null => {
  const { t } = useTranslation();
  const sidebarItems = Object.values(items).filter((item) =>
    isItemControlSidebar(item),
  );
  if (!sidebarItems || sidebarItems.length < 1) {
    return null;
  }

  const translatedSidebarItems = translations[targetLanguage].sidebarItems;
  const getTranslation = (linkId: string): string => {
    if (translatedSidebarItems[linkId]) {
      return translatedSidebarItems[linkId].markdown || "";
    }
    return "";
  };

  const dispatchTranslation = (linkId: string, value: string): void => {
    dispatch(updateSidebarTranslationAction(targetLanguage, linkId, value));
  };

  return (
    <div>
      <div className="translation-section-header">{t("Sidebar")}</div>
      {sidebarItems.map((item) => {
        if (!item.code || !item._text || !item._text.extension) {
          return null;
        }
        const { code, display } = item.code[0];
        const { valueMarkdown } = item._text.extension[0];
        const translatedMarkdown = getTranslation(item.linkId);

        return (
          <div
            key={`${targetLanguage}-${item.linkId}`}
            className="translation-group"
          >
            <div className="translation-group-header">
              {`${display} (${code})`}
            </div>
            <div className="translation-row">
              <FormField>
                <MarkdownEditor data={valueMarkdown || ""} disabled={true} />
              </FormField>
              <FormField>
                <div
                  className={
                    !translatedMarkdown?.trim()
                      ? "error-highlight"
                      : "warning-highlight"
                  }
                >
                  <MarkdownEditor
                    data={translatedMarkdown}
                    onBlur={(value) => dispatchTranslation(item.linkId, value)}
                  />
                </div>
              </FormField>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TranslateSidebar;
