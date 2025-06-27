import React, { useContext } from "react";

import { useTranslation } from "react-i18next";
import Btn from "src/components/Btn/Btn";
import { TreeContext } from "src/store/treeStore/treeStore";

import { getValueSetValues } from "../../../helpers/valueSetHelper";
import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./existinValueSets.module.scss";

const ExistingValueSets = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { canEdit, handleEdit } = useValueSetContext();

  const {
    state: { qContained },
  } = useContext(TreeContext);

  return (
    <div className={styles.existingValueSets}>
      <h2>{"Predefined Value Sets"}</h2>

      {qContained?.map((x) => (
        <div key={x.id}>
          <p>
            <strong>{`${x.title}`}</strong> {`(${x.name || x.id})`}
            {canEdit(x.url) && (
              <Btn
                title={t("Change")}
                type="button"
                variant="secondary"
                onClick={() => handleEdit(x)}
              />
            )}
          </p>
          <ul className={styles.existingValueSetsList}>
            {getValueSetValues(x).map((y) => (
              <li
                className={styles.existingValueSetsListItems}
                key={y.code}
              >{`${y.display} (${y.code})`}</li>
            ))}
          </ul>
        </div>
      ))}
      <pre className="json-container">
        {JSON.stringify(qContained, null, 2)}
      </pre>
    </div>
  );
};
export default ExistingValueSets;
