import { CodeSystemConceptProperty } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import CodeSystemProperty from "./CodeSystemProperty";
import useNewCodeSystemProperties from "./useNewCodeSystemProperties";

import styles from "./code-system-properties.module.scss";

type Props = {
  properties?: CodeSystemConceptProperty[];
  conceptIndex: number;
};
const CodeSystemProperties = ({
  properties,
  conceptIndex,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { handleAddNewProperty } = useNewCodeSystemProperties();
  return (
    <div className={styles.codeSystemProperties}>
      <div className={styles.propertiesHeader}>
        <h3>{"Properties"}</h3>
      </div>
      <Button
        variant="borderless"
        ariaLabel="test"
        onClick={() => handleAddNewProperty(conceptIndex)}
      >
        <Icon svgIcon={PlussIcon} /> {t("Add Property")}
      </Button>
      <div className={styles.propertiesList}>
        {properties?.map(
          (property: CodeSystemConceptProperty, index: number) => (
            <CodeSystemProperty
              property={property}
              index={index}
              key={property.code}
              conceptIndex={conceptIndex}
            />
          ),
        )}
      </div>
    </div>
  );
};
export default CodeSystemProperties;
