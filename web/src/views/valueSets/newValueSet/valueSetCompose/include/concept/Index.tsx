import { ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { Extensions } from "src/components/extensions/Extensions";

import Details from "./Details";
import useValueSetComposeIncludeConcept from "./useValueSetComposeIncludeConcept";

import styles from "./valuset-compose-include-details.module.scss";
type Props = {
  concepts?: ValueSetComposeIncludeConcept[];
  includeIndex?: number;
};

export const Concepts = ({
  concepts,
  includeIndex,
}: Props): React.JSX.Element => {
  const { updateExtensions } = useValueSetComposeIncludeConcept();
  const { t } = useTranslation();
  return (
    <div className={styles.conceptContainer}>
      {concepts?.map((item, index) => {
        return (
          <div key={item.id || index} className={styles.conceptItem}>
            <Details
              item={item}
              index={index}
              includeIndex={includeIndex}
              hasMoreThanOneConcept={!!concepts?.length && concepts?.length > 1}
            />
            <Extensions
              idType="id"
              id={item.id || ""}
              key={item.id || index}
              extensions={item.extension}
              updateExtensions={updateExtensions}
              buttonText={t("Add extension")}
            />
          </div>
        );
      })}
    </div>
  );
};
