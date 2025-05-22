import * as fs from "fs";

import { Bundle } from "fhir/r4";

export const q1: Bundle = JSON.parse(
  fs.readFileSync(__dirname + "/Bundle_with_duplicate_ids.json").toString(),
);
