import { describe, it, expect } from "vitest";

import type { Bundle, Questionnaire, QuestionnaireItem } from "fhir/r4";

import { sanitizeJsonInPlace } from "../sanitizeMarkdownExtensions";

const MARKDOWN_URL =
  "http://hl7.org/fhir/StructureDefinition/rendering-markdown";

function makeItem(
  linkId: string,
  text: string,
  valueMarkdown?: string,
): QuestionnaireItem {
  return {
    linkId,
    type: "string",
    text,
    _text: {
      extension: [{ url: MARKDOWN_URL, valueMarkdown }],
    },
  };
}

function makeQuestionnaire(items: QuestionnaireItem[]): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "draft",
    item: items,
  };
}

function makeBundle(questionnaires: Questionnaire[]): Bundle {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total: questionnaires.length,
    entry: questionnaires.map((q) => ({ resource: q })),
  };
}

describe("sanitizeJsonInPlace", () => {
  describe("Questionnaire input", () => {
    it("fills missing valueMarkdown from item.text", () => {
      const q = makeQuestionnaire([makeItem("1", "Hello **world**")]);
      sanitizeJsonInPlace(q);

      const ext = q.item![0]._text?.extension?.[0];
      expect(ext?.valueMarkdown).toBe("Hello **world**");
    });

    it("fills empty string valueMarkdown from item.text", () => {
      const q = makeQuestionnaire([makeItem("1", "Some text", "")]);
      sanitizeJsonInPlace(q);

      const ext = q.item![0]._text?.extension?.[0];
      expect(ext?.valueMarkdown).toBe("Some text");
    });

    it("does not overwrite existing valueMarkdown", () => {
      const q = makeQuestionnaire([
        makeItem("1", "Plain text", "**Markdown** text"),
      ]);
      sanitizeJsonInPlace(q);

      const ext = q.item![0]._text?.extension?.[0];
      expect(ext?.valueMarkdown).toBe("**Markdown** text");
    });

    it("does not touch items without _text.extension", () => {
      const q = makeQuestionnaire([
        { linkId: "1", type: "string", text: "No extension" },
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text).toBeUndefined();
    });

    it("does not touch items without rendering-markdown URL", () => {
      const q = makeQuestionnaire([
        {
          linkId: "1",
          type: "string",
          text: "Text",
          _text: {
            extension: [
              { url: "http://other-extension", valueString: "something" },
            ],
          },
        },
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension?.[0]).toEqual({
        url: "http://other-extension",
        valueString: "something",
      });
    });

    it("sanitizes nested items recursively", () => {
      const q = makeQuestionnaire([
        {
          linkId: "group-1",
          type: "group",
          text: "Group",
          item: [makeItem("child-1", "Nested **text**")],
        },
      ]);
      sanitizeJsonInPlace(q);

      const childExt = q.item![0].item![0]._text?.extension?.[0];
      expect(childExt?.valueMarkdown).toBe("Nested **text**");
    });

    it("does not sanitize when item.text is empty", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: "string",
        text: "",
        _text: {
          extension: [{ url: MARKDOWN_URL, valueMarkdown: undefined }],
        },
      };
      const q = makeQuestionnaire([item]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension?.[0].valueMarkdown).toBeUndefined();
    });
  });

  describe("Bundle input", () => {
    it("sanitizes all questionnaires in the bundle", () => {
      const main = makeQuestionnaire([makeItem("1", "Norsk tekst")]);
      const translation = makeQuestionnaire([makeItem("1", "English text")]);
      const bundle = makeBundle([main, translation]);
      sanitizeJsonInPlace(bundle);

      const mainExt = main.item![0]._text?.extension?.[0];
      const translationExt = translation.item![0]._text?.extension?.[0];
      expect(mainExt?.valueMarkdown).toBe("Norsk tekst");
      expect(translationExt?.valueMarkdown).toBe("English text");
    });

    it("handles bundle with non-Questionnaire resources", () => {
      const bundle: Bundle = {
        resourceType: "Bundle",
        type: "searchset",
        total: 1,
        entry: [
          { resource: { resourceType: "Patient" } as unknown as Questionnaire },
        ],
      };
      // Should not throw
      expect(() => sanitizeJsonInPlace(bundle)).not.toThrow();
    });

    it("handles bundle with empty entries array", () => {
      const bundle: Bundle = {
        resourceType: "Bundle",
        type: "searchset",
        total: 0,
        entry: [],
      };
      expect(() => sanitizeJsonInPlace(bundle)).not.toThrow();
    });

    it("handles bundle with no entry property", () => {
      const bundle: Bundle = {
        resourceType: "Bundle",
        type: "searchset",
      };
      expect(() => sanitizeJsonInPlace(bundle)).not.toThrow();
    });
  });

  describe("positive: mixed and multi-extension items", () => {
    it("sanitizes only items that need it among siblings", () => {
      const q = makeQuestionnaire([
        makeItem("1", "Needs fix"),
        makeItem("2", "Already ok", "**ok**"),
        makeItem("3", "Also needs fix", ""),
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension?.[0].valueMarkdown).toBe("Needs fix");
      expect(q.item![1]._text?.extension?.[0].valueMarkdown).toBe("**ok**");
      expect(q.item![2]._text?.extension?.[0].valueMarkdown).toBe(
        "Also needs fix",
      );
    });

    it("fills valueMarkdown on markdown extension and leaves other extensions untouched", () => {
      const q = makeQuestionnaire([
        {
          linkId: "1",
          type: "string",
          text: "My text",
          _text: {
            extension: [
              { url: "http://other-url", valueString: "keep me" },
              { url: MARKDOWN_URL, valueMarkdown: undefined },
            ],
          },
        },
      ]);
      sanitizeJsonInPlace(q);

      const exts = q.item![0]._text?.extension;
      expect(exts?.[0]).toEqual({
        url: "http://other-url",
        valueString: "keep me",
      });
      expect(exts?.[1].valueMarkdown).toBe("My text");
    });

    it("sanitizes deeply nested items (3+ levels)", () => {
      const q = makeQuestionnaire([
        {
          linkId: "g1",
          type: "group",
          text: "Level 1",
          item: [
            {
              linkId: "g2",
              type: "group",
              text: "Level 2",
              item: [makeItem("deep", "Deep **text**")],
            },
          ],
        },
      ]);
      sanitizeJsonInPlace(q);

      const deepExt = q.item![0].item![0].item![0]._text?.extension?.[0];
      expect(deepExt?.valueMarkdown).toBe("Deep **text**");
    });
  });

  describe("negative: no mutation expected", () => {
    it("does not mutate when Questionnaire has no items", () => {
      const q: Questionnaire = {
        resourceType: "Questionnaire",
        status: "draft",
      };
      expect(() => sanitizeJsonInPlace(q)).not.toThrow();
      expect(q.item).toBeUndefined();
    });

    it("does not mutate when item has _text but extension is empty array", () => {
      const q = makeQuestionnaire([
        {
          linkId: "1",
          type: "string",
          text: "Text",
          _text: { extension: [] },
        },
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension).toEqual([]);
    });

    it("does not mutate when item.text is undefined", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: "string",
        _text: {
          extension: [{ url: MARKDOWN_URL, valueMarkdown: undefined }],
        },
      };
      const q = makeQuestionnaire([item]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension?.[0].valueMarkdown).toBeUndefined();
    });

    it("does not mutate when _text has no extension property", () => {
      const q = makeQuestionnaire([
        {
          linkId: "1",
          type: "string",
          text: "Text",
          _text: {} as QuestionnaireItem["_text"],
        },
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension).toBeUndefined();
    });

    it("does not mutate items that only have non-markdown extensions", () => {
      const q = makeQuestionnaire([
        {
          linkId: "1",
          type: "string",
          text: "Text",
          _text: {
            extension: [{ url: "http://some-other-url", valueString: "other" }],
          },
        },
      ]);
      sanitizeJsonInPlace(q);

      expect(q.item![0]._text?.extension?.[0]).toEqual({
        url: "http://some-other-url",
        valueString: "other",
      });
    });
  });
});
