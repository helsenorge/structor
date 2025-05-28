import * as fs from "fs";

import { Bundle } from "fhir/r4";

const q1: Bundle = JSON.parse(
  fs
    .readFileSync(__dirname + "/language_polish_english_norwegian.json")
    .toString(),
);
const q2: Bundle = JSON.parse(
  fs.readFileSync(__dirname + "/language_english_norwegian.json").toString(),
);
const q3: Bundle = JSON.parse(
  fs
    .readFileSync(__dirname + "/language_norwegian_no-lang-code.json")
    .toString(),
);
const q4: Bundle = JSON.parse(
  fs.readFileSync(__dirname + "/language_no-lang-code.json").toString(),
);
const q5: Bundle = JSON.parse(
  fs.readFileSync(__dirname + "/Bundle_with_duplicate_ids.json").toString(),
);
export { q1, q2, q3, q4, q5 };
