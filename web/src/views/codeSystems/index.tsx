import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollToElement } from "src/hooks/useScrollToElement";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import ExistingCodeSystem from "./existing";
import NewCodeSystem from "./new";
import UploadCodeSystem from "./upload";

import styles from "./codeSystems.module.scss";
const CodeSystems = (): React.JSX.Element => {
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
    <section className={styles.codeSystems} ref={targetRef}>
      <h1 className={styles.codeSystemsHeadline}>{t("CodeSystems")}</h1>
      <Tabs
        ariaLabelLeftButton="Scroll left"
        ariaLabelRightButton="Scroll right"
        sticky
        className={styles.codeSystemsTabs}
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
          <ExistingCodeSystem scrollToTarget={scrollToTarget} />
        </Tabs.Tab>

        <Tabs.Tab
          onTabClick={() => {
            navigate("upload");
          }}
          title={t("Upload Code System")}
        >
          <UploadCodeSystem />
        </Tabs.Tab>
      </Tabs>
    </section>
  );
};
export default CodeSystems;
