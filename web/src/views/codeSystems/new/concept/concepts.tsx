import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import Concept from "./concept";
import useConcept from "./useConcept";

import styles from "./code-system-concept.module.scss";

const CodeSystemConceptIndex = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { concept, addNewConcept } = useConcept();

  return (
    <div className={styles.codeSystemConceptIndex}>
      <div className={styles.addNewConceptButton}>
        <Button
          variant="borderless"
          onClick={addNewConcept}
          ariaLabel={t("Add concept")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("Add concept")}
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
