import React from "react";

import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import ChevronLeft from "@helsenorge/designsystem-react/components/Icons/ChevronLeft";
import ChevronRight from "@helsenorge/designsystem-react/components/Icons/ChevronRight";

import styles from "./raw-json.module.scss";

type Props = {
  className?: string;
  side?: "left" | "right";
  jsonContent: unknown;
  showButton?: boolean;
};

const RawJson = ({
  className,
  side,
  jsonContent,
  showButton = true,
}: Props): React.JSX.Element => {
  const [showRawJson, setShowRawJson] = React.useState(false);
  const { t } = useTranslation();
  const showOutput = !showButton ? true : showRawJson;
  const jsonString = JSON.stringify(jsonContent, null, 2);
  return (
    <div className={`${styles.rawJsonContainer} ${className || ""}`}>
      {showOutput && (
        <div className={styles.jsonContainerWrapper}>
          <h3>{t("Raw JSON")}</h3>
          <pre className={styles.jsonContainer}>{jsonString}</pre>
        </div>
      )}
      {showButton && (
        <Button
          variant="borderless"
          size="medium"
          onClick={() => setShowRawJson(!showRawJson)}
          ariaLabel={t("Show raw JSON")}
        >
          {showRawJson ? (
            <div className={styles.rawJsonButton}>
              <Icon svgIcon={side === "right" ? ChevronRight : ChevronLeft} />
            </div>
          ) : (
            <div className={styles.rawJsonButton}>
              <Icon svgIcon={side === "right" ? ChevronLeft : ChevronRight} />
            </div>
          )}
        </Button>
      )}
    </div>
  );
};
export default RawJson;
