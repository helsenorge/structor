import { useState, type JSX } from "react";

import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import { ValueSetDetails } from "./details/ValueSetDetails";
import useNewValueSet from "./useNewValueset";
import ValuseSetCompose from "./valueSetCompose/ValuseSetCompose";
import PredefinedValueSetModal from "../../../components/PredefinedValueSetModal/PredefinedValueSetModal";
import RawJson from "../../components/rawJson";
import { useValueSetContext } from "../context/useValueSetContext";

import styles from "./new-value-set.module.scss";
type Props = {
  scrollToTarget: () => void;
};
const NewValueSet = ({ scrollToTarget }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { setNewValueSet } = useValueSetContext();
  const {
    startNewValueSet,
    dispatchValueSet,
    dispatchDeleteValueSet,
    isNewValueSet,
    newValueSet,
  } = useNewValueSet({ scrollToTarget });

  return (
    <div className={styles.newValueSet}>
      <div className={styles.valueSetTabsContainer}>
        <Tabs
          resources={{
            ariaLabelLeftButton: "Scroll left",
            ariaLabelRightButton: "Scroll right",
          }}
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
        <Button variant="outline" onClick={() => setShowModal(true)}>
          {t("Simple mode")}
        </Button>
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
      <RawJson
        showButton={false}
        jsonContent={newValueSet}
        side="right"
        showHeadline={false}
      />
      {showModal && (
        <PredefinedValueSetModal
          onSaved={(valueSet) => {
            setNewValueSet(() => JSON.parse(JSON.stringify(valueSet)));
          }}
          close={() => {
            setShowModal(false);
            scrollToTarget();
          }}
        />
      )}
    </div>
  );
};
export default NewValueSet;
