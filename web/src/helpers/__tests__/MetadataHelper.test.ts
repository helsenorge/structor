import { Questionnaire, Meta } from "fhir/r4";
import { describe, beforeAll, it, expect } from "vitest";

import {
  addMetaSecurityIfDoesNotExist,
  getTjenesteomraadeCoding,
  isValidTitel,
  tjenesteomraadeCode,
} from "../MetadataHelper";

describe(`MetadataHelpere`, () => {
  let questionnaire: Questionnaire;
  beforeAll(() => {
    questionnaire = {
      meta: {
        profile: [
          "http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire",
        ],
        tag: [
          {
            system: "urn:ietf:bcp:47",
            code: "nb-NO",
            display: "Bokmål",
          },
        ],
      },
      useContext: [
        {
          code: {
            system: "http://hl7.org/fhir/ValueSet/usage-context-type",
            code: "focus",
            display: "Clinical Focus",
          },
          valueCodeableConcept: {
            coding: [
              {
                system: "urn:oid:2.16.578.1.12.4.1.1.7615",
              },
            ],
          },
        },
      ],
    } as Questionnaire;
  });

  describe("addMetaSecurityIfDoesNotExist", () => {
    it(`Add security according to useContext when form does not have a security from before`, () => {
      questionnaire = addMetaSecurityIfDoesNotExist(questionnaire);
      expect(questionnaire.meta?.security?.[0]).toBe(
        getTjenesteomraadeCoding(tjenesteomraadeCode.helseregister),
      );
    });

    it(`Does not add security according to useContext when form does have a security from before`, () => {
      const newMeta = {
        ...questionnaire.meta,
        security: [getTjenesteomraadeCoding(tjenesteomraadeCode.sekundærbruk)],
      } as Meta;
      questionnaire = { ...questionnaire, meta: newMeta } as Questionnaire;

      questionnaire = addMetaSecurityIfDoesNotExist(questionnaire);
      expect(questionnaire.meta?.security?.[0]).not.toBe(
        getTjenesteomraadeCoding(tjenesteomraadeCode.helseregister),
      );
    });
  });

  describe("isValidTitel", () => {
    it("Titel has special character", () => {
      const result = isValidTitel("@Test".trim());
      expect(result).toBeFalsy();
    });

    it("Titel has html tag", () => {
      const result = isValidTitel("<br>Test</br>".trim());
      expect(result).toBeFalsy();
    });

    it("Acceptable titel", () => {
      const result = isValidTitel(
        "Titel must not have special character".trim(),
      );
      expect(result).toBeTruthy();
    });
  });
});
