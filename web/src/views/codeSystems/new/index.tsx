import { useContext } from "react";

import { useTranslation } from "react-i18next";
import {
  removeFhirResourceAction,
  updateFhirResourceAction,
} from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";
import RawJson from "src/views/components/rawJson";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import CodeSystemConceptIndex from "./concept/concepts";
import CodeSystemDetails from "./details";
import { useCodeSystemContext } from "../context/useCodeSystemContext";
import CodeSystemFilters from "./codeSystemFilter/CodeSystemFilters";
import Properties from "./properties/Properties";

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
    dispatch(
      updateFhirResourceAction({
        ...newCodeSystem,
        count: newCodeSystem.concept?.length,
      }),
    );
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newCodeSystem.id) {
      dispatch(removeFhirResourceAction(newCodeSystem));
      reset();
      scrollToTarget();
    }
  };
  const isNewCodeSystem =
    !newCodeSystem.id || !qContained?.some((x) => x.id === newCodeSystem.id);
  return (
    <div>
      <div>
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
          <Tabs.Tab title={"Properties"}>
            <Properties />
          </Tabs.Tab>
          <Tabs.Tab title={"Filter"}>
            <CodeSystemFilters />
          </Tabs.Tab>
        </Tabs>
      </div>
      <div className={styles.newCodeSystemButtons}>
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
      <RawJson showButton={false} jsonContent={newCodeSystem} side="right" />
    </div>
  );
};

export default NewCodeSystem;
