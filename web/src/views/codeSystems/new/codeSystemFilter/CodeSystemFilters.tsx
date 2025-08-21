import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import CodeSystemFilterInput from "./codeSystemFilter";
import useCodeSystemFilter from "./useCodeSystemFilter";

import styles from "./code-system-filter.module.scss";

const CodeSystemFilters = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { filter, updateFilter, addNewFilter, removeFilter } =
    useCodeSystemFilter();
  return (
    <div>
      <div className={styles.addNewFilterButton}>
        <Button
          variant="borderless"
          onClick={addNewFilter}
          ariaLabel={t("New filter")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("New filter")}
        </Button>
      </div>
      <div>
        {filter?.map((filter, index) => (
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
              onClick={() => removeFilter(index)}
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
