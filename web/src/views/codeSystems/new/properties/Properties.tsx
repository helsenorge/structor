import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import Property from "./Property";
import useProperty from "./useProperty";

import styles from "./code-system-properties.module.scss";

const Properties = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { addNewProperty, properties } = useProperty();
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
        {properties?.map((prop, index) => (
          <Property key={prop.id} index={index} property={prop} />
        ))}
      </div>
    </div>
  );
};
export default Properties;
