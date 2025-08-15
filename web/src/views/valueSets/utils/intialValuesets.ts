import {
  Coding,
  ValueSet,
  ValueSetComposeInclude,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";

export const initialComposeInclude = (): ValueSetComposeInclude => ({
  id: createUUID(),
  system: createUriUUID(),
  concept: [valueSetComposeIncludeConcept()],
});
export const valueSetComposeIncludeConcept =
  (): ValueSetComposeIncludeConcept => ({
    id: createUUID(),
    code: "",
    display: "",
  });
export const initValueSet = (): ValueSet => ({
  resourceType: "ValueSet",
  id: createUUID(),
  version: "1.0",
  name: "",
  title: "",
  date: new Date().toISOString(),
  status: "draft",
  publisher: "",
  url: "",
  compose: {
    include: [],
  },
});

export const initialCoding = (): Coding => ({
  id: createUUID(),
  code: "",
  display: "",
  system: createUriUUID(),
});
