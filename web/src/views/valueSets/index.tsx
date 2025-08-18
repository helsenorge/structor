import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollToElement } from "src/hooks/useScrollToElement";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import ImportValueSet from "./ImportValueSet/Index";
import NewValueSet from "./newValueSet/NewValueSet";
import Upload from "../components/upload/Upload";

import styles from "./valueSets.module.scss";
const ValueSets = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = React.useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { t } = useTranslation();
  const { targetRef, scrollToTarget } = useScrollToElement<HTMLDivElement>();
  const setTabToNewValueSetTab = (): void => {
    navigate("new");
  };
  useEffect(() => {
    if (pathname.endsWith("new")) {
      setActiveTab(0);
    } else if (pathname.endsWith("existing")) {
      setActiveTab(1);
    } else if (pathname.endsWith("import")) {
      setActiveTab(2);
    } else if (pathname.endsWith("upload")) {
      setActiveTab(3);
    }
  }, [pathname]);

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
        <Tabs.Tab
          onTabClick={() => {
            navigate("new");
          }}
          title={t("New Value Set")}
        >
          <NewValueSet scrollToTarget={scrollToTarget} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("existing");
          }}
          title={t("Existing Value Sets")}
        >
          <ExistingValueSets scrollToTarget={setTabToNewValueSetTab} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("import");
          }}
          title={t("Import Value Set")}
        >
          <ImportValueSet />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("upload");
          }}
          title={t("Upload Value Set")}
        >
          <Upload resourceType="ValueSet" />
        </Tabs.Tab>
      </Tabs>
    </section>
  );
};
export default ValueSets;
