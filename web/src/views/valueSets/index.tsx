import React, { useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useScrollToElement } from "src/hooks/useScrollToElement";
import { TreeContext } from "src/store/treeStore/treeStore";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import ImportValueSet from "./ImportValueSet/Index";
import NewValueSet from "./newValueSet/NewValueSet";
import SectionHeader from "../components/sectionHeader/SectionHeader";
import Upload from "../components/upload/Upload";

import styles from "./valueSets.module.scss";
const ValueSets = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { state } = useContext(TreeContext);
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
      <SectionHeader
        id={state.qMetadata.id}
        headline={t("ValueSets")}
        linkText={t("To form builder")}
      />
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
          title={t("New ValueSet")}
        >
          <NewValueSet scrollToTarget={scrollToTarget} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("existing");
          }}
          title={t("Existing ValueSets")}
        >
          <ExistingValueSets scrollToTarget={setTabToNewValueSetTab} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("import");
          }}
          title={t("Import ValueSet")}
        >
          <ImportValueSet />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("upload");
          }}
          title={t("Upload ValueSet")}
        >
          <Upload resourceType="ValueSet" />
        </Tabs.Tab>
      </Tabs>
    </section>
  );
};
export default ValueSets;
