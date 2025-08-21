import { Extension } from "fhir/r4";
import { removeSpace } from "src/helpers/formatHelper";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";

type ReturnType = {
  updateExtensions: (
    extensions: Extension[],
    id: string,
    idType?: "linkId" | "id",
  ) => void;
  removeElement: (id?: string) => void;
  updateConceptItem: (
    value: string,
    updateField: "code" | "display",
    eventType: "blur" | "change",
    includeIndex?: number,
    id?: string,
  ) => void;
  copyComposeIncludeConcept: (id?: string, includeIndex?: number) => void;
};

const useValueSetComposeIncludeConcept = (): ReturnType => {
  const { setNewValueSet, newValueSet, copyComposeIncludeConcept } =
    useValueSetContext();

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
  const updateConceptItem = (
    value: string,
    updateField: "code" | "display",
    eventType: "blur" | "change" = "change",
    includeIndex = 0,
    id?: string,
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
  return {
    updateExtensions,
    updateConceptItem,
    removeElement,
    copyComposeIncludeConcept,
  };
};
export default useValueSetComposeIncludeConcept;
