import { describe, it, expect, vi, afterEach, Mock } from "vitest";
import type { TFunction } from "react-i18next";
import type { QuestionnaireItem } from "fhir/r4";

vi.mock("src/helpers/constants", () => ({
  MAX_ATTACHMENT_ALLOWED: 3,
  MAX_ATTACHMENT_SIZE_MB: 5,
}));

vi.mock("@helsenorge/refero", () => {
  return {
    getMaxSizeExtensionValue: vi.fn(),
    getMaxOccursExtensionValue: vi.fn(),
  };
});

// 2) Now import SUT and mocked symbols (after mocks)
import { attachementValidation } from "src/components/Validation/ElementValidation/attachementValidation";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import {
  getMaxSizeExtensionValue,
  getMaxOccursExtensionValue,
} from "@helsenorge/refero";

const t = ((s: string) => s) as unknown as TFunction<"translation">;

// Builders
const qAtt = (overrides: Partial<QuestionnaireItem> = {}): QuestionnaireItem =>
  ({
    linkId: overrides.linkId ?? "att-1",
    type: IQuestionnaireItemType.attachment,
    text: overrides.text,
    extension: overrides.extension as any,
  }) as QuestionnaireItem;

const qNotAtt = (
  overrides: Partial<QuestionnaireItem> = {},
): QuestionnaireItem =>
  ({
    linkId: overrides.linkId ?? "q-1",
    type: IQuestionnaireItemType.group,
    extension: overrides.extension as any,
  }) as QuestionnaireItem;

// Known extensions (positions matter for index assertions)
const ext = {
  foo: { url: "urn:foo", valueString: "x" },
  maxSize: { url: IExtensionType.maxSize, valueDecimal: 10 }, // MB
  maxOccurs: { url: IExtensionType.maxOccurs, valueInteger: 10 },
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("attachementValidation()", () => {
  describe("validateMaxSize (indirekte)", () => {
    it("returnerer [] når qItem ikke er attachment", () => {
      const item = qNotAtt();
      expect(attachementValidation(t, item)).toEqual([]);
    });

    it("returnerer [] når maxSize mangler eller er <= grense", () => {
      let item = qAtt({ extension: [ext.foo] }); // no maxSize
      expect(attachementValidation(t, item)).toEqual([]);

      item = qAtt({ extension: [ext.maxSize, ext.foo] });
      // force equal to limit (5 MB) for this run
      (getMaxSizeExtensionValue as Mock).mockReturnValueOnce(5);
      expect(attachementValidation(t, item)).toEqual([]);
    });

    it("warning når maxSize > MAX_ATTACHMENT_SIZE_MB, med riktig index og tekst", () => {
      const item = qAtt({ linkId: "att-x", extension: [ext.foo, ext.maxSize] });
      (getMaxSizeExtensionValue as Mock).mockReturnValueOnce(10); // > 5

      const [err] = attachementValidation(t, item);
      expect(err).toMatchObject({
        errorLevel: ErrorLevel.warning,
        errorProperty: ValidationType.extension,
        linkId: "att-x",
        index: 1,
        errorReadableText: "Attachment size exceeds maximum limit of 5Mb",
      });
    });

    it("index=-1 når extension-lista mangler men verdi rapporteres (edge via mock)", () => {
      const item = qAtt({ extension: undefined });
      (getMaxSizeExtensionValue as Mock).mockReturnValueOnce(999);

      const [err] = attachementValidation(t, item);
      expect(err.index).toBe(-1);
    });
  });

  describe("validateMaxOccurrencesAttachment (indirekte)", () => {
    it("returnerer [] når maxOccurs mangler eller er <= grense", () => {
      let item = qAtt({ extension: [ext.foo] }); // no maxOccurs
      expect(attachementValidation(t, item)).toEqual([]);

      item = qAtt({ extension: [ext.maxOccurs] });
      (getMaxOccursExtensionValue as Mock).mockReturnValueOnce(3); // == limit
      expect(attachementValidation(t, item)).toEqual([]);
    });

    it("warning når maxOccurs > MAX_ATTACHMENT_ALLOWED, med riktig index og tekst", () => {
      const item = qAtt({
        linkId: "att-y",
        extension: [ext.maxOccurs, ext.foo],
      });
      (getMaxOccursExtensionValue as Mock).mockReturnValueOnce(10); // > 3

      const [err] = attachementValidation(t, item);
      expect(err).toMatchObject({
        errorLevel: ErrorLevel.warning,
        errorProperty: ValidationType.extension,
        linkId: "att-y",
        index: 0, // position of maxOccurs
        errorReadableText: "Attachment exceeds maximum limit of 3",
      });
    });

    it("index=-1 når extension-lista mangler men verdi rapporteres (edge via mock)", () => {
      const item = qAtt({ extension: undefined });
      (getMaxOccursExtensionValue as Mock).mockReturnValueOnce(42);

      const [err] = attachementValidation(t, item);
      expect(err.index).toBe(-1);
    });
  });

  describe("aggregert", () => {
    it("returnerer både size- og occurrences-feil i rekkefølge", () => {
      const item = qAtt({
        linkId: "att-both",
        extension: [ext.foo, ext.maxSize, ext.maxOccurs],
      });

      (getMaxSizeExtensionValue as Mock).mockReturnValueOnce(8); // > 5
      (getMaxOccursExtensionValue as Mock).mockReturnValueOnce(7); // > 3

      const errors = attachementValidation(t, item);
      expect(errors).toHaveLength(2);

      expect(errors[0]).toMatchObject({
        linkId: "att-both",
        index: 1,
        errorReadableText: "Attachment size exceeds maximum limit of 5Mb",
      });
      expect(errors[1]).toMatchObject({
        linkId: "att-both",
        index: 2,
        errorReadableText: "Attachment exceeds maximum limit of 3",
      });
    });

    it("returnerer [] når ingen regler trigges", () => {
      const item = qAtt({ extension: [ext.foo] });
      (getMaxSizeExtensionValue as Mock).mockReturnValueOnce(undefined);
      (getMaxOccursExtensionValue as Mock).mockReturnValueOnce(undefined);

      expect(attachementValidation(t, item)).toEqual([]);
    });
  });
});
