import { ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { removeSpace } from "src/helpers/formatHelper";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import styles from "./valuset-compose-include-details.module.scss";
type Props = {
  item: ValueSetComposeIncludeConcept;
  index?: number;
  includeIndex?: number;
  hasMoreThanOneConcept: boolean;
};

const ValuseSetComposeIncludeDetails = ({
  item,
  index,
  includeIndex,
}: Props): React.JSX.Element => {
  const { newValueSet, setNewValueSet, copyComposeIncludeConcept } =
    useValueSetContext();
  const { t } = useTranslation();

  const removeElement = (id?: string): void => {
    const compose = { ...newValueSet.compose };

    if (compose.include) {
      for (const item of compose.include) {
        const conceptToDelete = item.concept?.findIndex(
          (x) => x && x.id === id,
        );

        if (conceptToDelete !== undefined && conceptToDelete >= 0) {
          item.concept?.splice(conceptToDelete, 1);
          break;
        }
      }
    }

    setNewValueSet({ ...newValueSet });
  };
  const handleConceptItem = (
    value: string,
    updateField: "code" | "display",
    id?: string,
    eventType: "blur" | "change" = "change",
    includeIndex = 0,
  ): void => {
    const compose = { ...newValueSet.compose };

    const item =
      compose.include &&
      compose.include[includeIndex].concept?.find((x) => x && x.id === id);

    if (item) {
      item[updateField] = value;
    }

    if (updateField === "display" && item) {
      if (
        item.code === undefined ||
        (item.code === "" && eventType === "blur")
      ) {
        item.code = removeSpace(value);
      }
    }

    setNewValueSet({ ...newValueSet });
  };
  return (
    <div className={styles.answerOptionItem} key={item.id || index}>
      <div className={styles.answerOptionbuttons}>
        <Button
          ariaLabel="Copy element"
          variant="borderless"
          onClick={() => copyComposeIncludeConcept(item.id, includeIndex)}
        >
          {t("Copy")}
          <Icon svgIcon={Copy} />
        </Button>
      </div>

      <div className={styles.answerOptionInputs}>
        <Input
          value={item.display}
          placeholder={t("Enter a display value..")}
          onBlur={(event) =>
            handleConceptItem(
              event.target.value,
              "display",
              item.id,
              "blur",
              includeIndex,
            )
          }
          onChange={(event) =>
            handleConceptItem(
              event.target.value,
              "display",
              item.id,
              "change",
              includeIndex,
            )
          }
          label={<Label labelTexts={[{ text: t("Display") }]} />}
        />
        <Input
          value={item.code}
          placeholder={t("Enter a code value..")}
          onChange={(event) =>
            handleConceptItem(
              event.target.value,
              "code",
              item.id,
              "change",
              includeIndex,
            )
          }
          label={<Label labelTexts={[{ text: t("Code") }]} />}
        />
      </div>
      <div className={styles.answerOptionbuttons}>
        <Button
          type="button"
          size="medium"
          variant="borderless"
          onClick={() => removeElement(item.id)}
          name={t("Remove element")}
          ariaLabel="Remove element"
          concept="destructive"
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default ValuseSetComposeIncludeDetails;
