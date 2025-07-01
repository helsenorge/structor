import type { ExtensionValue, ExtensionValueKey } from "./types";
import type {
  CodeableConcept,
  Coding,
  Distance,
  Extension,
  Quantity,
} from "fhir/r4";

export const getDefaultValueForType = (
  type: ExtensionValueKey,
):
  | false
  | 0
  | ""
  | Coding
  | CodeableConcept
  | Quantity
  | Distance
  | Duration => {
  switch (type) {
    case "valueBoolean":
      return false;
    case "valueInteger":
    case "valueDecimal":
      return 0;
    case "valueCoding":
      return {
        system: "",
        code: "",
        display: "",
      } as Coding;
    case "valueCodeableConcept":
      return {
        text: "",
        coding: [
          {
            system: "",
            code: "",
            display: "",
          },
        ],
      } as CodeableConcept;
    case "valueQuantity":
    case "valueDistance":
      return {
        value: 0,
        unit: "",
        system: "",
        code: "",
      } as Quantity | Distance;
    case "valueDuration":
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
      } as Duration;
    default:
      return "";
  }
};

export const getExtensionValue = (ext: Extension): ExtensionValue => {
  for (const key of Object.keys(EXTENSION_VALUE_TYPES) as ExtensionValueKey[]) {
    if (ext[key] !== undefined && ext[key] !== null) {
      return {
        type: key,
        value: ext[key],
      };
    }
  }

  return {
    type: null,
    value: undefined,
  };
};
export const EXTENSION_VALUE_TYPES: Partial<Record<ExtensionValueKey, string>> =
  {
    valueBoolean: "Boolean",
    valueString: "String",
    valueInteger: "Integer",
    valueDecimal: "Decimal",
    valueQuantity: "Quantity",
    valueCode: "Code",
    valueCodeableConcept: "CodeableConcept",
    valueDate: "Date",
    valueDateTime: "DateTime",
    valueTime: "Time",
    valueCoding: "Coding",
    valueDistance: "Distance",
    valueDuration: "Duration",
  } as const;
