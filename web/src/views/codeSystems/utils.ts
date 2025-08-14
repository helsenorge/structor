import {
  CodeSystem,
  CodeSystemConcept,
  CodeSystemConceptDesignation,
  CodeSystemConceptProperty,
  CodeSystemFilter,
  CodeSystemProperty,
  Coding,
  Identifier,
} from "fhir/r4";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";

export const initialCodeSystem = (): CodeSystem => ({
  resourceType: "CodeSystem",
  id: createUUID(),
  content: "not-present",
  version: "1.0",
  name: "",
  title: "",
  date: new Date().toISOString(),
  status: "draft",
  publisher: "",
  url: "https://nhn.no/code-system/",
  caseSensitive: true,
  language: "nb-NO",
  concept: [],
  property: [],
  description: "",
});
export const initialConcept = (): CodeSystemConcept => ({
  id: createUUID(),
  code: "",
  display: "",
  definition: "",
  designation: [],
  property: [],
});
export const initialDesignation = (): CodeSystemConceptDesignation => ({
  id: createUUID(),
  language: "",
  value: "",
});

export const initialProperty = (): CodeSystemConceptProperty => ({
  id: createUUID(),
  code: "",
});

export const initialCoding = (): Coding => ({
  id: createUUID(),
  code: "",
  display: "",
  system: createUriUUID(),
});
export const initialCodeSystemProperty = (): CodeSystemProperty => ({
  id: createUUID(),
  code: "",
  type: "string",
  description: "",
  uri: createUriUUID(),
});
export const initialCodeSystemFilter = (): CodeSystemFilter => ({
  id: createUUID(),
  value: "",
  code: "",
  operator: ["exists"],
});
export const initialIdentifier = (): Identifier => ({
  id: createUUID(),
  use: "official",
  system: createUriUUID(),
  value: "",
});
