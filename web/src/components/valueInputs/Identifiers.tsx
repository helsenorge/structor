import { Identifier } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Expander from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import Label from "@helsenorge/designsystem-react/components/Label";

import IdentifierInput from "./Identifier";

import styles from "./value-input.module.scss";
type Props = {
  identifiers: Identifier[] | undefined;
  addNewIdentifier: () => void;
  handleChange: (index: number, value: Identifier | undefined) => void;
  collapsable?: boolean;
};
const Identifiers = ({
  identifiers,
  addNewIdentifier,
  handleChange,
  collapsable,
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
          {t("Add identifier")}
        </Button>
      </div>
      <ExpanderList>
        {identifiers?.map((identifier, index) =>
          collapsable ? (
            <Expander
              title={identifier.id || t("New Identifier")}
              key={identifier.id}
              expanded={index === 0}
              contentClassNames={styles.expanderContent}
            >
              <div className={styles.identifierInputContainer}>
                <IdentifierInput
                  value={identifier}
                  onChange={(value) => handleChange(index, value)}
                />
              </div>
            </Expander>
          ) : (
            <div
              className={styles.identifierInputContainer}
              key={identifier.id || identifier.system || index}
            >
              <IdentifierInput
                value={identifier}
                onChange={(value) => handleChange(index, value)}
              />
            </div>
          ),
        )}
      </ExpanderList>
    </>
  );
};

export default Identifiers;
