import React from "react";

import { useTranslation } from "react-i18next";

import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import Details from "./details/Index";
import Include from "./include/Index";

import styles from "./valueSetCompose.module.scss";
const ValueSetCompose = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Tabs
      ariaLabelLeftButton="Scroll left"
      ariaLabelRightButton="Scroll right"
      sticky
      className={styles.valueSetCompose}
    >
      <Tabs.Tab title={t("Details")}>
        <Details />
      </Tabs.Tab>
      <Tabs.Tab title={t("Include")}>
        <Include />
      </Tabs.Tab>
      <Tabs.Tab title={t("Exclude")}>
        <p>{t("Not implemented")}</p>
      </Tabs.Tab>
    </Tabs>
  );
};
export default ValueSetCompose;
