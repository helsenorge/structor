import React from "react";

import { CodeSystemConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import CodeSystemDesignations from "../../components/codeSystemDesignation/CodeSystemDesignations";
import CodeSystemProperties from "../../components/codeSystemProperty/CodeSystemProperties";
import { useCodeSystemContext } from "../../context/useCodeSystemContext";

import styles from "./code-system-concept.module.scss";
type ConceptProps = {
  concept: CodeSystemConcept;
  index: number;
};

const Concept = ({ concept, index }: ConceptProps): React.JSX.Element => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const { t } = useTranslation();

  const updateConcept = (key: keyof CodeSystemConcept, value: string): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.map((c) =>
        c.id === concept.id ? { ...c, [key]: value } : c,
      ),
    }));
  };
  const removeConcept = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      concept: prev?.concept?.filter((c) => c.id !== concept.id),
    }));
  };
  return (
    <div className={styles.singleConceptContainer}>
      <div className={styles.inputContainer}>
        <Input
          value={concept.display}
          onChange={(event) => updateConcept("display", event.target.value)}
          label="Display"
        />
        <Input
          value={concept.code}
          onChange={(event) => updateConcept("code", event.target.value)}
          label="Code"
        />
        <Input
          value={concept.definition}
          onChange={(event) => updateConcept("definition", event.target.value)}
          label="Definition"
        />
        <CodeSystemDesignations
          designations={concept.designation}
          conceptIndex={index}
        />
        <CodeSystemProperties
          properties={concept.property}
          conceptIndex={index}
        />
      </div>
      <div className={styles.headerContainer}>
        <Button
          variant="borderless"
          onClick={() => removeConcept()}
          ariaLabel={t("Remove include")}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default Concept;
