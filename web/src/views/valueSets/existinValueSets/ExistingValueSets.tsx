import React, { useContext } from "react";

import { useTranslation } from "react-i18next";
import { useScrollToElement } from "src/hooks/useScrollToElement";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Down from "@helsenorge/designsystem-react/components/Icons/ChevronDown";
import Up from "@helsenorge/designsystem-react/components/Icons/ChevronUp";

import { PreviewValueSet } from "./PreviewValueSet";
import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./existinValueSets.module.scss";

const ExistingValueSets = (): React.JSX.Element => {
  const { newValueSet } = useValueSetContext();
  const [showRawJson, setShowRawJson] = React.useState(false);
  const { t } = useTranslation();
  const { targetRef, scrollToTarget } = useScrollToElement<HTMLDivElement>();
  const {
    state: { qContained },
  } = useContext(TreeContext);
  return (
    <div className={styles.existingValueSets} ref={targetRef}>
      <header>
        <h2>{t("Existing Value Sets")}</h2>
        <Button
          variant="borderless"
          size="medium"
          onClick={() => setShowRawJson(!showRawJson)}
          ariaLabel={t("Show raw JSON")}
        >
          {showRawJson ? (
            <div className={styles.rawJsonButton}>
              <span>{t("Hide raw JSON")}</span>

              <Icon svgIcon={Up} />
            </div>
          ) : (
            <div className={styles.rawJsonButton}>
              <span>{t("Show raw JSON")}</span>
              <Icon svgIcon={Down} />
            </div>
          )}
        </Button>
        {showRawJson && (
          <pre className={styles.jsonContainer}>
            {JSON.stringify(newValueSet, null, 2)}
          </pre>
        )}
      </header>

      {qContained?.map((x, i) => (
        <PreviewValueSet
          key={x.id}
          valueSet={x}
          scrollToTarget={scrollToTarget}
          valueSetIndex={i}
        />
      ))}
    </div>
  );
};
export default ExistingValueSets;
