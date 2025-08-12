import { useContext } from "react";

import { useTranslation } from "react-i18next";
import {
  removeCodeSystemAction,
  updateCodeSystemAction,
} from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import RawJson from "src/views/valueSets/newValueSet/rawJson";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import CodeSystemConceptIndex from "./concept";
import CodeSystemDetails from "./details";
import { useCodeSystemContext } from "../context/useCodeSystemContext";

import styles from "./new-code-system.module.scss";

type Props = {
  scrollToTarget: () => void;
};

const NewCodeSystem = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { qContained },
  } = useContext(TreeContext);
  const { newCodeSystem, reset } = useCodeSystemContext();

  const startNewValueSet = (): void => {
    reset();
    scrollToTarget();
  };
  const dispatchValueSet = (): void => {
    dispatch(updateCodeSystemAction(newCodeSystem));
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newCodeSystem.id) {
      dispatch(removeCodeSystemAction(newCodeSystem));
      reset();
      scrollToTarget();
    }
  };
  const isNewCodeSystem =
    !newCodeSystem.id || !qContained?.some((x) => x.id === newCodeSystem.id);
  return (
    <div className={styles.newCodeSystem}>
      <div className={styles.codeSystemTabsContainer}>
        <Tabs
          ariaLabelLeftButton="Scroll left"
          ariaLabelRightButton="Scroll right"
          sticky
          className={styles.codeSystemTabs}
        >
          <Tabs.Tab title={"Details"}>
            <CodeSystemDetails />
          </Tabs.Tab>
          <Tabs.Tab title={"Concept"}>
            <CodeSystemConceptIndex />
          </Tabs.Tab>
        </Tabs>
        <RawJson showButton={false} jsonContent={newCodeSystem} side="right" />
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
        {!isNewCodeSystem && (
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
    </div>
  );
};

export default NewCodeSystem;
