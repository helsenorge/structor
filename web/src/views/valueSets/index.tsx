import React from "react";

import { useTranslation } from "react-i18next";
import { useScrollToElement } from "src/hooks/useScrollToElement";

import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import NewValueSet from "./newValueSet/NewValueSet";

import styles from "./valueSets.module.scss";
const ValueSets = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { targetRef, scrollToTarget } = useScrollToElement<HTMLDivElement>();

  return (
    <section className={styles.valueSets} ref={targetRef}>
      <h1 className={styles.valueSetsHeadline}>{t("ValueSets")}</h1>
      <div className={styles.predefinedContainer}>
        <NewValueSet scrollToTarget={scrollToTarget} />
        <ExistingValueSets scrollToTarget={scrollToTarget} />
      </div>
    </section>
  );
};
export default ValueSets;
