import { ValueSetComposeInclude } from "fhir/r4";
import createUUID from "src/helpers/CreateUUID";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";
import { initialComposeInclude } from "src/views/valueSets/utils/intialValuesets";

type ReturnType = {
  handleUpdateValue: (
    value: string,
    includeIndex: number,
    key: "system" | "version",
  ) => void;
  addNewElement: (includeIndex?: number) => void;
  removeInclude: (includeIndex: number) => void;
  addNewInclude: () => void;
  include: ValueSetComposeInclude[] | undefined;
};

const useValueSetInclude = (): ReturnType => {
  const { newValueSet, setNewValueSet } = useValueSetContext();

  const addNewInclude = (): void => {
    setNewValueSet((prevState) => ({
      ...prevState,
      compose: {
        ...prevState.compose,
        include: [
          ...(prevState.compose?.include || []),
          initialComposeInclude(),
        ],
      },
    }));
  };
  const removeInclude = (includeIndex: number): void => {
    setNewValueSet((prevState) => {
      const updatedInclude =
        prevState.compose?.include?.filter(
          (_, index) => index !== includeIndex,
        ) || [];
      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: updatedInclude,
        },
      };
    });
  };

  const handleUpdateValue = (
    value: string,
    includeIndex: number,
    key: "system" | "version",
  ): void => {
    const compose = { ...newValueSet.compose };
    compose.include && (compose.include[includeIndex][key] = value);
    setNewValueSet({ ...newValueSet });
  };

  const addNewElement = (includeIndex = 0): void => {
    const newValueSetCopy = { ...newValueSet };
    if (newValueSetCopy.compose?.include?.[includeIndex]?.concept) {
      newValueSetCopy.compose.include[includeIndex].concept?.push({
        id: createUUID(),
        code: "",
        display: "",
      });
    } else if (newValueSetCopy.compose?.include?.[includeIndex]) {
      newValueSetCopy.compose.include[includeIndex].concept = [
        {
          id: createUUID(),
          code: "",
          display: "",
        },
      ];
    }
    setNewValueSet({ ...newValueSetCopy });
  };
  return {
    handleUpdateValue,
    addNewElement,
    removeInclude,
    addNewInclude,
    include: newValueSet.compose?.include,
  };
};
export default useValueSetInclude;
