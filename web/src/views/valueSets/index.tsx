import React from "react";

import { useTranslation } from "react-i18next";
import { useScrollToElement } from "src/hooks/useScrollToElement";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import ImportValueSet from "./ImportValueSet/Index";
import NewValueSet from "./newValueSet/NewValueSet";

import styles from "./valueSets.module.scss";
const ValueSets = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { t } = useTranslation();
  const { targetRef, scrollToTarget } = useScrollToElement<HTMLDivElement>();
  const setTabToNewValueSetTab = (): void => {
    setActiveTab(0);
  };
  return (
    <section className={styles.valueSets} ref={targetRef}>
      <h1 className={styles.valueSetsHeadline}>{t("ValueSets")}</h1>
      <Tabs
        ariaLabelLeftButton="Scroll left"
        ariaLabelRightButton="Scroll right"
        sticky
        className={styles.valueSetTabs}
        activeTab={activeTab}
      >
        <Tabs.Tab onTabClick={() => setActiveTab(0)} title={t("New Value Set")}>
          <NewValueSet scrollToTarget={scrollToTarget} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => setActiveTab(1)}
          title={t("Existing Value Sets")}
        >
          <ExistingValueSets scrollToTarget={setTabToNewValueSetTab} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => setActiveTab(2)}
          title={t("Import Value Set")}
        >
          <ImportValueSet />
        </Tabs.Tab>
      </Tabs>
    </section>
  );
};
export default ValueSets;
