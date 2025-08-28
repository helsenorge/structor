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
  showHeadline?: boolean;
};

const RawJson = ({
  className,
  side,
  jsonContent,
  showButton = true,
  showHeadline = true,
}: Props): React.JSX.Element => {
  const [showRawJson, setShowRawJson] = React.useState(false);
  const { t } = useTranslation();
  const showOutput = !showButton ? true : showRawJson;
  const jsonString = JSON.stringify(jsonContent, null, 2);
  return (
    <div className={`${styles.rawJsonContainer} ${className || ""}`}>
      {showOutput && (
        <div className={styles.jsonContainerWrapper}>
          {showHeadline && (
            <h3 data-testid="raw-json-headline">{t("Raw JSON")}</h3>
          )}
          <code className={styles.jsonContainer}>{jsonString}</code>
        </div>
      )}
      {showButton && (
        <Button
          variant="borderless"
          size="medium"
          testId="toggle-raw-json"
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
