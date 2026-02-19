import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";

import type { ValueSet } from "fhir/r4";

export const initValueSet = (): ValueSet => ({
  resourceType: "ValueSet",
  id: createUUID(),
  version: "1.0",
  name: "",
  title: "",
  date: new Date().toISOString(),
  status: "draft",
  publisher: "",
  compose: {
    id: createUUID(),
    include: [
      {
        system: createUriUUID(),
        concept: [
          {
            id: createUUID(),
            code: "",
            display: "",
          },
          {
            id: createUUID(),
            code: "",
            display: "",
          },
        ],
      },
    ],
  },
});
