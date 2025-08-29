import React, { useContext, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollToElement } from "src/hooks/useScrollToElement";
import { TreeContext } from "src/store/treeStore/treeStore";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import ExistingCodeSystem from "./existing";
import NewCodeSystem from "./new";
import SectionHeader from "../components/sectionHeader/SectionHeader";
import UploadCodeSystem from "../components/upload/Upload";

import styles from "./codeSystems.module.scss";

const CodeSystems = (): React.JSX.Element => {
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
    } else if (pathname.endsWith("upload")) {
      setActiveTab(2);
    }
  }, [pathname]);

  return (
    <section className={styles.codeSystems} ref={targetRef}>
      <SectionHeader
        id={state.qMetadata.id}
        headline={t("CodeSystems")}
        linkText={t("To form builder")}
      />

      <Tabs
        ariaLabelLeftButton="Scroll left"
        ariaLabelRightButton="Scroll right"
        sticky
        activeTab={activeTab}
      >
        <Tabs.Tab
          onTabClick={() => {
            navigate("new");
          }}
          title={t("New Code System")}
        >
          <NewCodeSystem scrollToTarget={scrollToTarget} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("existing");
          }}
          title={t("Existing Code Systems")}
        >
          <ExistingCodeSystem navigateToNewTab={setTabToNewValueSetTab} />
        </Tabs.Tab>
        <Tabs.Tab
          onTabClick={() => {
            navigate("upload");
          }}
          title={t("Upload Code System")}
        >
          <UploadCodeSystem resourceType="CodeSystem" />
        </Tabs.Tab>
      </Tabs>
    </section>
  );
};
export default CodeSystems;
