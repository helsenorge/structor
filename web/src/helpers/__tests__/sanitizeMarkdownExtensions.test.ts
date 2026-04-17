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
  });
});
