import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import Concept from "./concept";
import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialConcept } from "../../utils";

import styles from "./code-system-concept.module.scss";

const CodeSystemConceptIndex = (): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    newCodeSystem: { concept },
    setNewCodeSystem,
  } = useCodeSystemContext();
  const addNewConcept = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: [...(prev?.concept || []), initialConcept()],
    }));
  };

  return (
    <div className={styles.codeSystemConceptIndex}>
      <div className={styles.addNewConceptButton}>
        <Button
          variant="borderless"
          onClick={addNewConcept}
          ariaLabel={t("Add concept")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("New concept")}
        </Button>
      </div>

      <div className={styles.conceptContainer}>
        {concept?.map((cncpt, index) => (
          <Concept key={cncpt.id} concept={cncpt} index={index} />
        ))}
      </div>
    </div>
  );
};

export default CodeSystemConceptIndex;
