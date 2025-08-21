import React from "react";

import { CodeSystemConcept, Extension } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { Extensions } from "src/components/extensions/Extensions";
import IdInput from "src/components/extensions/valueInputs/IdInput";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import useConcept from "./useConcept";
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
  const { updateConcept, removeConcept } = useConcept();

  const updateExtensions = (extensions: Extension[], id: string): void => {
    setNewCodeSystem((prevState) => {
      const updatedConcepts =
        prevState.concept?.map((c) => {
          if (c.id === id) {
            return { ...c, extension: extensions };
          }
          return c;
        }) || [];
      return {
        ...prevState,
        concept: updatedConcepts,
      };
    });
  };
  return (
    <div className={styles.singleConceptContainer}>
      <div>
        <IdInput value={concept.id} />
        <Input
          value={concept.display}
          onChange={(event) =>
            updateConcept("display", event.target.value, concept)
          }
          label="Display"
        />
        <Input
          value={concept.code}
          onChange={(event) =>
            updateConcept("code", event.target.value, concept)
          }
          label="Code"
        />
        <Input
          value={concept.definition}
          onChange={(event) =>
            updateConcept("definition", event.target.value, concept)
          }
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
        <div className={styles.extensionsContainer}>
          <Label
            labelTexts={[
              {
                text: "Extensions",
              },
            ]}
          />
          <Extensions
            idType="id"
            id={concept.id || ""}
            key={concept.id || index}
            extensions={concept.extension}
            updateExtensions={updateExtensions}
            className={styles.conceptExtensions}
            buttonText={"Add extension"}
          />
        </div>
      </div>
      <div className={styles.headerContainer}>
        <Button
          variant="borderless"
          onClick={() => removeConcept(concept)}
          concept="destructive"
          ariaLabel={t("Remove include")}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default Concept;
