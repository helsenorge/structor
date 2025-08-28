import { Identifier } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import Label from "@helsenorge/designsystem-react/components/Label";

import IdentifierInput from "./Identifier";

import styles from "./value-input.module.scss";
type Props = {
  identifiers: Identifier[] | undefined;
  addNewIdentifier: () => void;
  handleChange: (index: number, value: Identifier | undefined) => void;
};
const Identifiers = ({
  identifiers,
  addNewIdentifier,
  handleChange,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <Label labelTexts={[{ text: "Identifier" }]} />
      <div className={styles.addNewIdentifierButton}>
        <Button
          variant="borderless"
          onClick={addNewIdentifier}
          ariaLabel={t("Add identifier")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("New identifier")}
        </Button>
      </div>
      {identifiers?.map((identifier, index) => (
        <div className={styles.identifierInputContainer} key={identifier.id}>
          <IdentifierInput
            value={identifier}
            onChange={(value) => handleChange(index, value)}
          />
        </div>
      ))}
    </>
  );
};

export default Identifiers;
