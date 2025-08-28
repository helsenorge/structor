import { CodeSystemFilter } from "fhir/r4";
import { useTranslation } from "react-i18next";
import IdInput from "src/components/valueInputs/IdInput";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";

import styles from "./code-system-filter.module.scss";

type Props = {
  filter: CodeSystemFilter;
  updateFilter: (filter: CodeSystemFilter) => void;
};

const CodeSystemFilterInput = ({
  filter,
  updateFilter,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div>
      <IdInput value={filter.id} />
      <Input
        value={filter.code}
        onChange={(event) =>
          updateFilter({
            ...filter,
            code: event.target.value,
          })
        }
        label="Code"
      />
      <div className={styles.addNewFilterButton}>
        <Button
          variant="borderless"
          onClick={() =>
            updateFilter({
              ...filter,
              operator: [...filter.operator, "exists"],
            })
          }
          ariaLabel={t("Add operator")}
        >
          <Icon svgIcon={PlussIcon} />
          {t("Add operator")}
        </Button>
      </div>
      {filter.operator.map((op, index) => (
        <div key={op} className={styles.filterOperatorContainer}>
          <Input
            value={op}
            onChange={(event) =>
              updateFilter({
                ...filter,
                operator: filter.operator.map((o, i) =>
                  i === index
                    ? (event.target.value as
                        | "is-a"
                        | "="
                        | "descendent-of"
                        | "is-not-a"
                        | "regex"
                        | "in"
                        | "not-in"
                        | "generalizes"
                        | "exists")
                    : o,
                ),
              })
            }
            label="Operator"
          />
          <Button
            variant="borderless"
            concept="destructive"
            onClick={() =>
              updateFilter({
                ...filter,
                operator: filter.operator?.filter((_, i) => i !== index),
              })
            }
            ariaLabel={t("Remove filter")}
          >
            <Icon svgIcon={TrashCan} />
          </Button>
        </div>
      ))}
      <Input
        value={filter.description}
        onChange={(event) =>
          updateFilter({
            ...filter,
            description: event.target.value,
          })
        }
        label="Description"
      />

      <Input
        value={filter.value}
        onChange={(event) =>
          updateFilter({
            ...filter,
            value: event.target.value,
          })
        }
        label="Filter"
      />
    </div>
  );
};
export default CodeSystemFilterInput;
