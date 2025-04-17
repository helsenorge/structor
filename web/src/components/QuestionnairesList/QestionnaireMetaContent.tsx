import React from "react";

import { useTranslation } from "react-i18next";
import { TreeState } from "src/store/treeStore/treeStore";
import "./questionnaire-meta-content.css";

interface Props {
  meta: TreeState["qMetadata"];
  lastModified?: Date;
}

export const QuestionnaireMetaContent: React.FC<Props> = ({
  meta,
  lastModified,
}) => {
  const { title, name, id, version } = meta;
  const { t } = useTranslation();

  return (
    <div className="meta-lines">
      <div className="meta-line">
        <strong>{t("Title")}</strong> {title || t("Untitled questionnaire")}
      </div>
      <div className="meta-line">
        <strong>{t("Technical name")}</strong> {name || t("Unnamed")}
      </div>
      <div className="meta-line">
        <strong>{"ID:"}</strong> {id ? `${id.substring(0, 8)}...` : t("N/A")}
      </div>
      <div className="meta-line">
        <strong>{t("Version")}</strong>{" "}
        {version !== undefined && version !== null ? version : t("N/A")}
      </div>
      <div className="meta-line">
        <strong>{t("Last modified")}</strong>{" "}
        {lastModified !== undefined && lastModified !== null
          ? lastModified.toLocaleString()
          : t("N/A")}
      </div>
    </div>
  );
};
