import { ValueSetComposeIncludeFilter } from "fhir/r4";
import { useTranslation } from "react-i18next";
import IdInput from "src/components/extensions/valueInputs/IdInput";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { useIncludeFilter } from "./useIncludeFilter";
import { isFilterOp, OPERATOR_LABELS, VS_FILTER_OPERATORS } from "./utils";

import styles from "./valueset-include-filter.module.scss";

type Props = {
  item?: ValueSetComposeIncludeFilter[];
  index?: number;
  includeIndex?: number;
};

const IncludeFilter = ({ item, includeIndex }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { addNewFilter, removeFilter, changeFilterValue } = useIncludeFilter(
    item,
    includeIndex,
  );
  return (
    <div className={styles.includeFilterContainer}>
      <Button
        variant="borderless"
        onClick={addNewFilter}
        ariaLabel={t("Add filter")}
        className={styles.addNewFilter}
      >
        <Icon svgIcon={PlussIcon} />
        {t("Add filter")}
      </Button>
      <div className={styles.filterList}>
        {item && (
          <div>
            {item.map((filterItem, filterIndex) => (
              <div
                key={filterItem.id || filterIndex}
                className={styles.filterItem}
              >
                <div>
                  <IdInput value={filterItem.id} />
                  <Select
                    label={<Label labelTexts={[{ text: "Operator" }]} />}
                    value={filterItem.op}
                    onChange={(e) => {
                      const v = e.currentTarget.value;
                      if (isFilterOp(v)) {
                        changeFilterValue({ ...filterItem, op: v });
                      }
                    }}
                  >
                    {VS_FILTER_OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {OPERATOR_LABELS[op]}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label={<Label labelTexts={[{ text: "Value" }]} />}
                    onChange={(e) =>
                      changeFilterValue({
                        ...filterItem,
                        value: e.target.value,
                      })
                    }
                    value={filterItem.value}
                  />
                  <Input
                    label={<Label labelTexts={[{ text: "Property" }]} />}
                    onChange={(e) =>
                      changeFilterValue({
                        ...filterItem,
                        property: e.target.value,
                      })
                    }
                    value={filterItem.property}
                  />
                </div>
                <div className={styles.removeButtonWrapper}>
                  <Button
                    variant="borderless"
                    onClick={() => removeFilter(filterItem)}
                    ariaLabel={t("Remove filter")}
                    concept="destructive"
                  >
                    <Icon svgIcon={TrashCan} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default IncludeFilter;
