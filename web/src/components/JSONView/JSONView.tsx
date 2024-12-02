import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import { generateQuestionnaire } from "../../helpers/generateQuestionnaire";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { TreeContext } from "../../store/treeStore/treeStore";
import IconBtn from "../IconBtn/IconBtn";

type Props = {
  showJSONView: () => void;
};

const JSONView = ({ showJSONView }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const handleCopy = async (): Promise<void> => {
    const content = JSON.stringify(
      JSON.parse(generateQuestionnaire(state)),
      null,
      2
    );
    await copyToClipboard(content);
  };
  return (
    <div className="overlay">
      <div className="structor-helper">
        <div className="title">
          <IconBtn type="x" title={t("Back")} onClick={showJSONView} />
          <h1>{t("JSON structure")}</h1>
          <div className="copyWrapper">
            <IconBtn
              position="right"
              color="white"
              size="large"
              type={isCopied ? "check" : "copy"}
              title={t("copyButton")}
              onClick={handleCopy}
            />
          </div>
        </div>

        <code className="json">
          {JSON.stringify(
            JSON.parse(generateQuestionnaire(state)),
            undefined,
            2
          )}
        </code>
      </div>
    </div>
  );
};

export default JSONView;
