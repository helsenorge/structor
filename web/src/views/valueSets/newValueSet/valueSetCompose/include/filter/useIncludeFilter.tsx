import { ValueSetComposeIncludeFilter } from "fhir/r4";
import { useValueSetContext } from "src/views/valueSets/context/useValueSetContext";
import { newIncludeFilterItem } from "src/views/valueSets/utils/intialValuesets";

export const useIncludeFilter = (
  filters?: ValueSetComposeIncludeFilter[],
  includeIndex?: number,
): {
  addNewFilter: () => void;
  removeFilter: (filterItem: ValueSetComposeIncludeFilter) => void;
  changeFilterValue: (filterItem: ValueSetComposeIncludeFilter) => void;
} => {
  const { newValueSet, setNewValueSet } = useValueSetContext();
  const addNewFilter = (): void => {
    const newFilter =
      filters && filters?.length > 0
        ? [...filters, newIncludeFilterItem()]
        : [newIncludeFilterItem()];
    setNewValueSet((prev) => {
      const includeArray = prev.compose?.include || [];

      return {
        ...prev,
        compose: {
          ...prev.compose,
          include: includeArray.map((include, idx) => {
            if (idx === includeIndex) {
              return { ...include, filter: newFilter };
            }
            return include;
          }),
        },
      };
    });
  };
  const removeFilter = (filterItem: ValueSetComposeIncludeFilter): void => {
    setNewValueSet((prevState) => {
      const includeArray = prevState.compose?.include || [];
      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: includeArray.map((include, idx) => {
            if (idx === includeIndex) {
              return {
                ...include,
                filter: include?.filter?.filter(
                  (filters) => filters !== filterItem,
                ),
              };
            }
            return include;
          }),
        },
      };
    });
  };
  const changeFilterValue = (
    filterItem: ValueSetComposeIncludeFilter,
  ): void => {
    setNewValueSet((prevState) => {
      const includeArray = prevState.compose?.include || [];
      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: includeArray.map((include, idx) => {
            if (idx === includeIndex) {
              return {
                ...include,
                filter: include?.filter?.map((filters) =>
                  filters.id === filterItem.id ? filterItem : filters,
                ),
              };
            }
            return include;
          }),
        },
      };
    });
  };
  return {
    addNewFilter,
    removeFilter,
    changeFilterValue,
  };
};
