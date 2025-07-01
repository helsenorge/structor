import React, { useContext } from "react";

import { useTranslation } from "react-i18next";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Change from "@helsenorge/designsystem-react/components/Icons/Change";
import Down from "@helsenorge/designsystem-react/components/Icons/ChevronDown";
import Up from "@helsenorge/designsystem-react/components/Icons/ChevronUp";

import { getValueSetValues } from "../../../helpers/valueSetHelper";
import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./existinValueSets.module.scss";

const ExistingValueSets = (): React.JSX.Element => {
  const { canEdit, handleEdit, newValueSet } = useValueSetContext();
  const [showRawJson, setShowRawJson] = React.useState(false);
  const { t } = useTranslation();
  const {
    state: { qContained },
  } = useContext(TreeContext);

  return (
    <div className={styles.existingValueSets}>
      <header>
        <h2>{"Predefined Value Sets"}</h2>
        <Button
          variant="borderless"
          size="large"
          onClick={() => setShowRawJson(!showRawJson)}
          ariaLabel={t("Show raw JSON")}
        >
          {showRawJson ? <Icon svgIcon={Up} /> : <Icon svgIcon={Down} />}
        </Button>
        {showRawJson && (
          <pre className={styles.jsonContainer}>
            {JSON.stringify(newValueSet, null, 2)}
          </pre>
        )}
      </header>

      {qContained?.map((x) => (
        <div key={x.id}>
          <div className={styles.existingValueSetsHeader}>
            <h3>
              <strong>{`${x.title}`}</strong> {`(${x.name || x.id})`}
            </h3>
            {canEdit(x.url) && (
              <Button
                ariaLabel="change value set"
                variant="outline"
                onClick={() => handleEdit(x)}
              >
                <Icon svgIcon={Change} />
              </Button>
            )}
          </div>
          <ul className={styles.existingValueSetsList}>
            {getValueSetValues(x).map((y, index) => (
              <li className={styles.existingValueSetsListItems} key={y.code}>
                <h4>{`item ${index + 1}`}</h4>
                <span>{"display"}</span>
                {`: ${y.display}`}
                <br />
                <span>{"code"}</span>
                {`: ${y.code}`}
                <br />
                {y.extension !== undefined && y.extension?.length > 0 && (
                  <>
                    <br />
                    <h4>{t("Extensions ")}</h4>
                    {y.extension.map((ext) => (
                      <span key={ext.id || ext.url}>
                        {Object.entries(ext).map(([key, value]) => (
                          <p
                            className={styles.extensionItem}
                            key={key}
                          >{`${key}: ${value}`}</p>
                        ))}
                      </span>
                    ))}

                    <br />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default ExistingValueSets;
