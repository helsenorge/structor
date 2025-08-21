import { ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import useValueSetComposeIncludeConcept from "./useValueSetComposeIncludeConcept";

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
  const { t } = useTranslation();
  const { copyComposeIncludeConcept, removeElement, updateConceptItem } =
    useValueSetComposeIncludeConcept();

  return (
    <div className={styles.answerOptionItem} key={item.id || index}>
      <div className={styles.answerOptionbuttons}>
        <Button
          ariaLabel={t("Copy element")}
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
            updateConceptItem(
              event.target.value,
              "display",
              "blur",
              includeIndex,
              item.id,
            )
          }
          onChange={(event) =>
            updateConceptItem(
              event.target.value,
              "display",
              "change",
              includeIndex,
              item.id,
            )
          }
          label={<Label labelTexts={[{ text: t("Display") }]} />}
        />
        <Input
          value={item.code}
          placeholder={t("Enter a code value..")}
          onChange={(event) =>
            updateConceptItem(
              event.target.value,
              "code",
              "change",
              includeIndex,
              item.id,
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
          ariaLabel={t("Remove element")}
          concept="destructive"
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default ValuseSetComposeIncludeDetails;
