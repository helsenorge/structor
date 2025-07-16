import { Extension } from "fhir/r4";
import { ICodeSystem } from "src/types/IQuestionnareItemType";

import { TableOptionsEnum } from "../types/tableOptions";

export const getTableCode = (
  extension: Extension | undefined,
): string | undefined => {
  let stringToReturn: string | undefined = undefined;
  extension?.valueCodeableConcept?.coding?.find((coding) => {
    if (
      coding.code === TableOptionsEnum.GTable ||
      coding.code === TableOptionsEnum.Table ||
      coding.code === TableOptionsEnum.TableHN1 ||
      coding.code === TableOptionsEnum.TableHN2
    ) {
      stringToReturn = coding.code;
    }
  });
  return stringToReturn;
};

export const isSystemTableConfigSystem = (system: string): boolean => {
  return (
    system === ICodeSystem.tableColumnName ||
    system === ICodeSystem.tableOrderingColumn ||
    system === ICodeSystem.tableOrderingFunctions ||
    system === ICodeSystem.tableColumn
  );
};
