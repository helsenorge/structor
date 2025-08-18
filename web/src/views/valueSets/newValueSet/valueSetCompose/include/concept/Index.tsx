import { Extension, ValueSetComposeIncludeConcept } from "fhir/r4";
import { Extensions } from "src/components/extensions/Extensions";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext.js";

import Details from "./Details";

import styles from "./valuset-compose-include-details.module.scss";
type Props = {
  concepts?: ValueSetComposeIncludeConcept[];
  includeIndex?: number;
};

export const Concepts = ({
  concepts,
  includeIndex,
}: Props): React.JSX.Element => {
  const { setNewValueSet } = useValueSetContext();

  const updateExtensions = (
    extensions: Extension[],
    id: string,
    idType: "linkId" | "id" = "id",
  ): void => {
    setNewValueSet((prevState) => {
      const updatedInclude =
        prevState.compose?.include?.map((inc) => {
          if (idType === "id" && inc.id === id) {
            return { ...inc, extension: extensions };
          }
          const concepts =
            inc.concept?.map((concept) => {
              if (concept.id === id) {
                return { ...concept, extension: extensions };
              }
              return concept;
            }) || [];
          return { ...inc, concept: concepts };
        }) || [];

      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: updatedInclude,
        },
      };
    });
  };

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
              buttonText="Add Extension"
            />
          </div>
        );
      })}
    </div>
  );
};
