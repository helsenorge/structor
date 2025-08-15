import React, { useContext, useState } from "react";

import { ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { importValueSetAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";

import FetchValueSet from "./FetchValueSet";
import PreviewValueSet from "../../components/preview/Preview";

import styles from "./importValueSet.module.scss";

const ImportValueSet = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const [valueSets, setValueSets] = useState<ValueSet[] | null>();

  const handleAddNewValueSet = (id: string): void => {
    const valueSetsToImport = valueSets?.filter((x) => x.id === id);
    if (valueSetsToImport && valueSetsToImport?.length > 0) {
      dispatch(importValueSetAction(valueSetsToImport));
    }
  };

  return (
    <div className={styles.importValueSet}>
      <FetchValueSet setValueSets={setValueSets} />

      {valueSets && (
        <div>
          <h3>{t("Available ValueSets")}</h3>
          {valueSets.map((valueSet) => {
            return (
              <div key={valueSet.id}>
                <PreviewValueSet
                  canEdit={false}
                  deleteResource={() => {}}
                  handleEdit={() => {}}
                  resourceType="ValueSet"
                  canDelete={false}
                  canDownload={false}
                  key={valueSet.id}
                  fhirResource={valueSet}
                />
                {valueSet.id && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleAddNewValueSet(valueSet.id!)}
                  >
                    {t("Import")}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImportValueSet;
