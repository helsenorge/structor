import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Check from "@helsenorge/designsystem-react/components/Icons/Check";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";
import X from "@helsenorge/designsystem-react/components/Icons/X";

import { generateQuestionnaire } from "../../helpers/generateQuestionnaire";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { TreeContext } from "../../store/treeStore/treeStore";

import styles from "./jsonview.module.scss";
type Props = {
  showJSONView: () => void;
  jsonContent?: unknown;
};

const JSONView = ({ showJSONView, jsonContent }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const content = jsonContent
    ? JSON.stringify(jsonContent, null, 2)
    : JSON.stringify(JSON.parse(generateQuestionnaire(state)), null, 2);
  const handleCopy = async (): Promise<void> => {
    await copyToClipboard(content);
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.structorHelper}>
        <div className={styles.title}>
          <Button
            ariaLabel={t("Back")}
            onClick={showJSONView}
            variant="borderless"
          >
            <Icon color="white" svgIcon={X} />
          </Button>
          <h1>{t("JSON structure")}</h1>
          <div className={styles.copyWrapper}>
            <Button
              variant="borderless"
              size="medium"
              ariaLabel={t("copyButton")}
              onClick={handleCopy}
            >
              {!isCopied ? (
                <Icon color="white" svgIcon={Copy} />
              ) : (
                <Icon color="white" svgIcon={Check} />
              )}
            </Button>
          </div>
        </div>

        <code className={styles.json}>
          {JSON.stringify(
            JSON.parse(generateQuestionnaire(state)),
            undefined,
            2,
          )}
        </code>
      </div>
    </div>
  );
};

export default JSONView;
