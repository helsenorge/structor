/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Extension } from "fhir/r4";

export type ExtensionValueKey = keyof Extension & `value${string}`;

export type ValueInputPropsMap = {
  [K in ExtensionValueKey]: {
    type: K | any;
    value: NonNullable<Extension[K]> | any;
    onChange: (newValue: NonNullable<Extension[K]> | any) => void;
  };
};

export type ExtensionValue = {
  type: ExtensionValueKey | null;
  value: NonNullable<Extension[ExtensionValueKey]> | undefined;
};
