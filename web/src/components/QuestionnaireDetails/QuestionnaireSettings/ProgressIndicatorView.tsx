import React, { useContext } from "react";

import { useTranslation } from "react-i18next";
import SwitchBtn from "src/components/SwitchBtn/SwitchBtn";
import {
  isVisibilityHideProgress,
  setItemControlExtension,
  VisibilityType,
} from "src/helpers/globalVisibilityHelper";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

const ProgressIndicatorView = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { qMetadata } = state;

  return (
    <FormField
      label={t("Progress indicator")}
      sublabel={t(
        "Choose whether you want to hide the progress indicator. The progress indicator is only available if the form is using a step-view",
      )}
    >
      <SwitchBtn
        onChange={() =>
          setItemControlExtension(
            qMetadata,
            VisibilityType.hideProgress,
            dispatch,
          )
        }
        value={isVisibilityHideProgress(qMetadata)}
        label={t("Hide progress indicator")}
      />
    </FormField>
  );
};

export default ProgressIndicatorView;
