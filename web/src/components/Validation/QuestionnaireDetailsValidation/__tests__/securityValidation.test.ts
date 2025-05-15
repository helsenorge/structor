import { Meta } from "fhir/r4";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";

import { tilgangsstyringsCode } from "src/helpers/MetadataHelper";
import { metaSecurityValidation } from "../securityValidation";
import { ErrorLevel, ValidationType } from "../../validationTypes";

describe("securityValidation", () => {
  describe("metaSecurityValidation", () => {
    const translatationMock = vi.fn();
    beforeEach(() => {
      translatationMock.mockClear();
    });

    it("Meta security has blocked adress code", () => {
      const meta = {
        security: [
          {
            code: "3",
            display: "Helsehjelp (Full)",
            system: "urn:oid:2.16.578.1.12.4.1.1.7618",
          },
          {
            code: "6",
            display: "Sperret adresse",
            system: "http://helsenorge.no/fhir/KanUtforesAv",
          },
        ],
      } as Meta;
      const metadata = { meta: meta } as IQuestionnaireMetadata;
      const validationErrors = metaSecurityValidation(
        translatationMock,
        metadata,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorProperty).toBe(ValidationType.security);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.info);
      expect(translatationMock.mock.calls[0]).toEqual([
        "There is a security code with blocked address access",
      ]);
    });

    it("Meta security has citizens between 13 - 16 code", () => {
      const meta = {
        security: [
          {
            code: "3",
            display: "Helsehjelp (Full)",
            system: "urn:oid:2.16.578.1.12.4.1.1.7618",
          },
          {
            code: "7",
            display: "Innbygger selv mellom 13 og 16 år",
            system: "http://helsenorge.no/fhir/KanUtforesAv",
          },
        ],
      } as Meta;
      const metadata = { meta: meta } as IQuestionnaireMetadata;
      const validationErrors = metaSecurityValidation(
        translatationMock,
        metadata,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorProperty).toBe(ValidationType.security);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.info);
      expect(translatationMock.mock.calls[0]).toEqual([
        "There is a security code with access for citizens with age between 13 - 16",
      ]);
    });

    it("Meta security has blocked adress code and has citizens between 13 - 16 code", () => {
      const meta = {
        security: [
          {
            code: "3",
            display: "Helsehjelp (Full)",
            system: "urn:oid:2.16.578.1.12.4.1.1.7618",
          },
          {
            code: "6",
            display: "Sperret adresse",
            system: "http://helsenorge.no/fhir/KanUtforesAv",
          },
          {
            code: "7",
            display: "Innbygger selv mellom 13 og 16 år",
            system: "http://helsenorge.no/fhir/KanUtforesAv",
          },
        ],
      } as Meta;
      const metadata = { meta: meta } as IQuestionnaireMetadata;
      const validationErrors = metaSecurityValidation(
        translatationMock,
        metadata,
      );

      expect(validationErrors.length).toBe(2);
      expect(translatationMock.mock.calls[0]).toEqual([
        "There is a security code with blocked address access",
      ]);
      expect(translatationMock.mock.calls[1]).toEqual([
        "There is a security code with access for citizens with age between 13 - 16",
      ]);
    });

    test.each([
      tilgangsstyringsCode.kunInnbygger,
      tilgangsstyringsCode.barnMellom12Og16,
      tilgangsstyringsCode.barnUnder12,
      tilgangsstyringsCode.representantOrdinaerFullmakt,
      tilgangsstyringsCode.representantTildeltFullmakt,
    ])(
      `Meta with security code %p is not special security code.`,
      (securitycode) => {
        const meta = {
          security: [
            {
              code: "3",
              display: "Helsehjelp (Full)",
              system: "urn:oid:2.16.578.1.12.4.1.1.7618",
            },
            {
              code: securitycode,
              system: "http://helsenorge.no/fhir/KanUtforesAv",
            },
          ],
        } as Meta;

        const metadata = { meta: meta } as IQuestionnaireMetadata;
        const validationErrors = metaSecurityValidation(
          translatationMock,
          metadata,
        );

        expect(validationErrors.length).toBe(0);
      },
    );
  });
});
