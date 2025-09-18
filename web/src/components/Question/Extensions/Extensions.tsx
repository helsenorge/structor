import React, { useContext } from "react";

import { Extension } from "fhir/r4";
import { Extensions } from "src/components/extensions/Extensions";
import { ValidationType } from "src/components/Validation/validationTypes";
import createUUID from "src/helpers/CreateUUID";
import { updateItemExtensionAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import { ValidationError } from "src/utils/validationUtils";

import style from "./q-extensions.module.scss";
type Props = {
  linkId: string;
  itemValidationErrors: ValidationError[];
};
const QExtensions = ({
  linkId,
  itemValidationErrors,
}: Props): React.JSX.Element => {
  const {
    dispatch,
    state: { qItems },
  } = useContext(TreeContext);

  const getExtension = (): Extension[] | undefined => {
    return qItems[linkId]?.extension?.map((ext) => {
      return { ...ext, id: ext.id || createUUID() };
    });
  };
  const hasValidationError = (index: number): string | false => {
    const errorLevel = itemValidationErrors.filter(
      (x) => x.errorProperty === ValidationType.extension && index === x.index,
    );
    return errorLevel.length > 0 ? errorLevel[0].errorLevel : false;
  };

  return (
    <div className={style.extensions}>
      <Extensions
        id={linkId}
        idType="linkId"
        updateExtensions={(extensions: Extension[], id: string) => {
          dispatch(updateItemExtensionAction(id, extensions));
        }}
        extensions={getExtension() || []}
        collapsable
        hasValidationError={hasValidationError}
      />
    </div>
  );
};

export default QExtensions;
