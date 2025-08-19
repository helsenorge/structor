import { CodeSystemFilter } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import CodeSystemFilterInput from "./codeSystemFilter";
import { useCodeSystemContext } from "../../context/useCodeSystemContext";
import { initialCodeSystemFilter } from "../../utils";

import styles from "./code-system-filter.module.scss";

const CodeSystemFilters = (): React.JSX.Element => {
  const { newCodeSystem, setNewCodeSystem } = useCodeSystemContext();
  const { t } = useTranslation();
  const updateFilter = (filter: CodeSystemFilter, index: number): void => {
    setNewCodeSystem((prev) => {
      const updatedFilters = prev.filter ? [...prev.filter] : [];
      updatedFilters[index] = filter;
      return {
        ...prev,
        filter: updatedFilters,
      };
    });
  };
  const addNewFilter = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      filter: [...(prev?.filter || []), initialCodeSystemFilter()],
    }));
  };
  return (
    <div>
      <div className={styles.addNewFilterButton}>
        <Button
          variant="borderless"
          onClick={addNewFilter}
          ariaLabel={t("Add filter")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("New filter")}
        </Button>
      </div>
      <div>
        {newCodeSystem.filter?.map((filter, index) => (
          <div key={filter.id} className={styles.filterContainer}>
            <CodeSystemFilterInput
              filter={filter}
              updateFilter={(updatedFilter) =>
                updateFilter(updatedFilter, index)
              }
            />
            <Button
              variant="borderless"
              concept="destructive"
              onClick={() =>
                setNewCodeSystem((prev) => ({
                  ...prev,
                  filter: prev.filter?.filter((_, i) => i !== index),
                }))
              }
              ariaLabel={t("Remove filter")}
            >
              <Icon svgIcon={TrashCan} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CodeSystemFilters;
