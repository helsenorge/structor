import { Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import { Extensions } from "../extensions/Extensions";
import IdInput from "../valueInputs/IdInput";

import styles from "./codingComponent.module.scss";
type Props = {
  coding: Coding;
  updateCoding: (coding: Coding) => void;
  removeCoding?: () => void;
  deleteText?: string;
};

const CodingComponent = ({
  coding,
  updateCoding,
  removeCoding,
  deleteText,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={styles.codingComponent}>
      <div>
        <IdInput value={coding.id} />
        <Input
          label={t("System")}
          value={coding.system}
          onChange={(e) => updateCoding({ ...coding, system: e.target.value })}
        />
        <Input
          label={t("Display")}
          value={coding.display}
          onChange={(e) => updateCoding({ ...coding, display: e.target.value })}
        />
        <Input
          label={t("Code")}
          value={coding.code}
          onChange={(e) => updateCoding({ ...coding, code: e.target.value })}
        />
        <Input
          label={t("Version")}
          value={coding.version}
          onChange={(e) => updateCoding({ ...coding, version: e.target.value })}
        />
        <Extensions
          buttonText={t("Add extension")}
          id={coding.id || ""}
          className={styles.extensions}
          extensions={coding.extension}
          collapsable
          updateExtensions={(extensions) =>
            updateCoding({ ...coding, extension: extensions })
          }
        />
      </div>

      <div className={styles.removeButtonWrapper}>
        {removeCoding && (
          <Button
            type="button"
            size="large"
            variant="borderless"
            onClick={removeCoding}
            concept="destructive"
            ariaLabel={deleteText ?? t("Delete coding")}
          >
            {deleteText ?? ""}
            <Icon svgIcon={TrashCan} />
          </Button>
        )}
      </div>
    </div>
  );
};
export default CodingComponent;
