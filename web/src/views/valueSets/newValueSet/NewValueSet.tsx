import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import { ValueSetDetails } from "./details/ValueSetDetails";
import ValuseSetCompose from "./valueSetCompose/ValuseSetCompose";
import {
  updateFhirResourceAction,
  removeFhirResourceAction,
} from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import RawJson from "../../components/rawJson";
import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./new-value-set.module.scss";
type Props = {
  scrollToTarget: () => void;
};
const NewValueSet = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const {
    dispatch,
    state: { qContained },
  } = useContext(TreeContext);
  const { newValueSet, reset } = useValueSetContext();

  const startNewValueSet = (): void => {
    reset();
    scrollToTarget();
  };
  const dispatchValueSet = (): void => {
    dispatch(updateFhirResourceAction(newValueSet));
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newValueSet.id) {
      dispatch(removeFhirResourceAction(newValueSet));
      reset();
      scrollToTarget();
    }
  };
  const isNewValueSet =
    !newValueSet.id || !qContained?.some((x) => x.id === newValueSet.id);

  return (
    <div className={styles.newValueSet}>
      <div className={styles.valueSetTabsContainer}>
        <Tabs
          ariaLabelLeftButton="Scroll left"
          ariaLabelRightButton="Scroll right"
          sticky
          className={styles.valueSetTabs}
        >
          <Tabs.Tab title={"Details"}>
            <ValueSetDetails />
          </Tabs.Tab>
          <Tabs.Tab title={"Compose"}>
            <ValuseSetCompose />
          </Tabs.Tab>
        </Tabs>
      </div>

      <div className={styles.newValueSetButtons}>
        <Button variant="outline" onClick={dispatchValueSet}>
          <Icon svgIcon={Save} />
          {t("Save")}
        </Button>
        <Button variant="outline" onClick={startNewValueSet}>
          <Icon svgIcon={Refresh} />

          {t("Reset")}
        </Button>
        {!isNewValueSet && (
          <Button
            variant="fill"
            concept="destructive"
            onClick={dispatchDeleteValueSet}
          >
            <Icon svgIcon={TrashCan} />
            {t("Delete")}
          </Button>
        )}
      </div>
      <RawJson showButton={false} jsonContent={newValueSet} side="right" />
    </div>
  );
};
export default NewValueSet;
