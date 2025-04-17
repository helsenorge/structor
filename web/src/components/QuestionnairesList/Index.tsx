// src/components/QuestionnairesList.tsx
import React, { useState, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { TreeState } from "src/store/treeStore/treeStore";

import "./questionnaires-list.css";
import { DeleteIcon } from "./Icons/DeleteIcon";
import { OpenIcon } from "./Icons/OpenIcon";
import { QuestionnaireIcon } from "./Icons/QuestionnaireIcon";
import { QuestionnaireMetaContent } from "./QestionnaireMetaContent";
import IconButton from "../List/IconButton/IconButton";
import { List } from "../List/Index";

interface Props {
  data: (TreeState & { lastModified?: Date })[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

const PAGE_SIZE = 10;

const QuestionnairesList = ({
  onDelete,
  onOpen,
  data: questionnaires,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // sort once, memoize.
  const sorted = useMemo(() => {
    return [...questionnaires].sort((a, b) => {
      if (!a.lastModified || !b.lastModified) return 0;
      return b.lastModified.getTime() - a.lastModified.getTime();
    });
  }, [questionnaires]);

  const visibleItems = sorted.slice(0, visibleCount);

  const hasMore = visibleCount < sorted.length;

  const handleShowMore = (): void => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, sorted.length));
  };

  const handleShowLess = (): void => {
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="questionnaires-list">
      <h3>{t("Previous Questionnaires")}</h3>
      <List variant="medium" dividers>
        {visibleItems.map((q) => (
          <List.Item key={q.qMetadata.id}>
            <List.Avatar alt={t("Questionnaire icon")}>
              <QuestionnaireIcon />
            </List.Avatar>
            <List.Content>
              <QuestionnaireMetaContent
                meta={q.qMetadata}
                lastModified={q.lastModified}
              />
            </List.Content>
            <List.Actions>
              <IconButton
                title={t("Open")}
                onClick={() => onOpen(q.qMetadata.id!)}
              >
                <OpenIcon />
              </IconButton>
              <IconButton
                title={t("Delete")}
                onClick={() => onDelete(q.qMetadata.id!)}
              >
                <DeleteIcon />
              </IconButton>
            </List.Actions>
          </List.Item>
        ))}
      </List>

      {hasMore || visibleCount > PAGE_SIZE ? (
        <div className="show-more-container">
          {hasMore ? (
            <button className="show-more-btn" onClick={handleShowMore}>
              {t("Show more")}
            </button>
          ) : (
            <button className="show-more-btn" onClick={handleShowLess}>
              {t("Show less")}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default QuestionnairesList;
