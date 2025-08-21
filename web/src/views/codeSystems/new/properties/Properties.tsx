import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import Property from "./Property";
import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialCodeSystemProperty } from "../../utils";

import styles from "./code-system-properties.module.scss";

const Properties = (): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    setNewCodeSystem,
    newCodeSystem: { property },
  } = useCodeSystemContext();

  const addNewProperty = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: [...(prev?.property || []), initialCodeSystemProperty()],
    }));
  };
  return (
    <div className={styles.propertiesContainer}>
      <div className={styles.addNewPropertyButton}>
        <Button
          variant="borderless"
          onClick={addNewProperty}
          ariaLabel={t("New property")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("New property")}
        </Button>
      </div>
      <div className={styles.singlePropertyContainer}>
        {property?.map((prop, index) => (
          <Property key={prop.id} index={index} property={prop} />
        ))}
      </div>
    </div>
  );
};
export default Properties;
