import { useContext } from "react";

import { useTranslation } from "react-i18next";
import { getValueSetValues } from "src/helpers/valueSetHelper";
import { getValueSetsFromState } from "src/store/treeStore/selectors";
import { TreeContext } from "src/store/treeStore/treeStore";
import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";

import type { ValueSet } from "fhir/r4";

import Button from "@helsenorge/designsystem-react/components/Button";

import { SimpleValueSetLabel } from "./SimpleValueSetLabel";

import styles from "./simpleValueset.module.scss";

type Props = {
  setNewValueSet: React.Dispatch<React.SetStateAction<ValueSet>>;
};

export const ExistingBasicValueSets = ({
  setNewValueSet,
}: Props): React.JSX.Element => {
  const { state } = useContext(TreeContext);
  const { t } = useTranslation();

  const canEdit = (type?: string): boolean => {
    return type !== predefinedValueSetUri;
  };
  const valueSets = getValueSetsFromState(state);

  const handleEdit = (valueSet: ValueSet): void => {
    const o = JSON.stringify(valueSet);
    setNewValueSet(JSON.parse(o));
  };
  return (
    <div>
      {valueSets?.map((x) => (
        <div key={x.id}>
          <div className={styles.valueSetHeader}>
            <strong>{`${x.title}`}</strong> {`(${x.name || x.id})`}
            {canEdit(x.url) && (
              <Button
                className={styles.marginLeft}
                size="medium"
                type="button"
                variant="outline"
                onClick={() => handleEdit(x)}
              >
                {t("Change")}
              </Button>
            )}
          </div>

          <ul className={styles.valueSetValues}>
            {getValueSetValues(x).map((y) => (
              <SimpleValueSetLabel
                key={y.code}
                code={y.code}
                display={y.display}
              />
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
};
