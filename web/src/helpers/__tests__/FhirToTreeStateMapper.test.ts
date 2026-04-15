import { describe, it, expect } from "vitest";

import { IExtensionType } from "../../types/IQuestionnareItemType";
import type { Bundle, Questionnaire } from "fhir/r4";

import {
  mapToTreeState,
  translateQuestionnaire,
} from "../FhirToTreeStateMapper";
import { generateQuestionnaire } from "../generateQuestionnaire";
import { markdownToPlainText } from "../markdownToPlainText";

function createItemWithMarkdown(
  linkId: string,
  text: string,
  markdown: string,
) {
  return {
    linkId,
    type: "string" as const,
    text,
    required: false,
    _text: {
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
          valueMarkdown: markdown,
        },
      ],
    },
  };
}

function createMinimalQuestionnaire(
  language: string,
  items: Questionnaire["item"],
): Questionnaire {
  return {
    resourceType: "Questionnaire",
    language,
    status: "draft",
    meta: {
      profile: ["http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire"],
      tag: [{ system: "urn:ietf:bcp:47", code: language }],
      security: [
        {
          code: "3",
          display: "Helsehjelp (Full)",
          system: "urn:oid:2.16.578.1.12.4.1.1.7618",
        },
      ],
    },
    item: items,
  };
}

function createBundleWithTranslation(
  mainQuestionnaire: Questionnaire,
  translationQuestionnaire: Questionnaire,
): Bundle {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total: 2,
    entry: [
      { resource: mainQuestionnaire },
      { resource: translationQuestionnaire },
    ],
  };
}

describe("translateQuestionnaire preserves markdown", () => {
  it("stores valueMarkdown in the markdown field of ItemTranslation", () => {
    const linkId = "item-1";
    const markdownText = "Tekst som skal **oversettes**";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdown(linkId, "Tekst som skal oversettes", markdownText),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdown(
        linkId,
        "Text to be translated",
        "Text to be **translated**",
      ),
    ]);

    const result = translateQuestionnaire(main, translation);

    expect(result.items[linkId].markdown).toBe("Text to be **translated**");
  });

  it("stores plain text (without markdown) in the text field", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdown(
        linkId,
        "Tekst som skal oversettes",
        "Tekst som skal **oversettes**",
      ),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdown(
        linkId,
        "Text to be translated",
        "Text to be **translated**",
      ),
    ]);

    const result = translateQuestionnaire(main, translation);

    expect(result.items[linkId].text).toBe("Text to be translated");
    expect(result.items[linkId].text).not.toContain("**");
  });

  it("falls back to item.text when no markdown extension exists", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      { linkId, type: "string", text: "Vanlig tekst", required: false },
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      { linkId, type: "string", text: "Plain text", required: false },
    ]);

    const result = translateQuestionnaire(main, translation);

    expect(result.items[linkId].text).toBe("Plain text");
    expect(result.items[linkId].markdown).toBeUndefined();
  });
});

describe("mapToTreeState with Bundle preserves markdown on translations", () => {
  it("preserves valueMarkdown in translation state when loading a Bundle", () => {
    const linkId = "e4cec3ea-a4a9-446c-8573-aab88622997f";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdown(
        linkId,
        "Tekst som skal oversettes",
        "Tekst som skal **oversettes**",
      ),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdown(
        linkId,
        "Text to be translated",
        "Text to be **translated**",
      ),
    ]);

    const bundle = createBundleWithTranslation(main, translation);
    const state = mapToTreeState(bundle);

    const enTranslation = state.qAdditionalLanguages?.["en-GB"];
    expect(enTranslation).toBeDefined();
    expect(enTranslation?.items[linkId].markdown).toBe(
      "Text to be **translated**",
    );
    expect(enTranslation?.items[linkId].text).toBe("Text to be translated");
  });
});

describe("round-trip: Bundle with markdown translations survives load and save", () => {
  it("preserves _text.valueMarkdown on translated items after round-trip", () => {
    const linkId = "e4cec3ea-a4a9-446c-8573-aab88622997f";
    const nbMarkdown = "Tekst som skal **oversettes**";
    const enMarkdown = "Text to be **translated**";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdown(linkId, "Tekst som skal oversettes", nbMarkdown),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdown(linkId, "Text to be translated", enMarkdown),
    ]);

    const bundle = createBundleWithTranslation(main, translation);

    // Load the bundle into tree state
    const state = mapToTreeState(bundle);

    // Re-generate the questionnaire (should produce a Bundle)
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    expect(output.resourceType).toBe("Bundle");
    expect(output.entry).toHaveLength(2);

    // Check main questionnaire preserves markdown
    const mainOutput = output.entry![0].resource as Questionnaire;
    const mainItem = mainOutput.item![0];
    const mainMarkdownExt = mainItem._text?.extension?.find(
      (e) =>
        e.url === "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
    );
    expect(mainMarkdownExt?.valueMarkdown).toBe(nbMarkdown);

    // Check translated questionnaire preserves markdown
    const translatedOutput = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedOutput.item![0];
    const translatedMarkdownExt = translatedItem._text?.extension?.find(
      (e) =>
        e.url === "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
    );
    expect(translatedMarkdownExt?.valueMarkdown).toBe(enMarkdown);
  });

  it("preserves _text.valueMarkdown on nested items after round-trip", () => {
    const groupLinkId = "group-1";
    const itemLinkId = "item-1";
    const nbMarkdown = "Norsk **markdown**";
    const enMarkdown = "English **markdown**";

    const main = createMinimalQuestionnaire("nb-NO", [
      {
        linkId: groupLinkId,
        type: "group" as const,
        text: "Gruppe",
        required: false,
        item: [
          createItemWithMarkdown(itemLinkId, "Norsk markdown", nbMarkdown),
        ],
      },
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      {
        linkId: groupLinkId,
        type: "group" as const,
        text: "Group",
        required: false,
        item: [
          createItemWithMarkdown(itemLinkId, "English markdown", enMarkdown),
        ],
      },
    ]);

    const bundle = createBundleWithTranslation(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedOutput = output.entry![1].resource as Questionnaire;
    const nestedItem = translatedOutput.item![0].item![0];
    const markdownExt = nestedItem._text?.extension?.find(
      (e) =>
        e.url === "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
    );
    expect(markdownExt?.valueMarkdown).toBe(enMarkdown);
  });
});

function createItemWithMarkdownText(linkId: string, markdown: string) {
  return {
    linkId,
    type: "string" as const,
    text: markdownToPlainText(markdown),
    required: false,
    _text: {
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
          valueMarkdown: markdown,
        },
      ],
    },
  };
}

describe("FhirToTreeStateMapper: import strips markdown from text", () => {
  it("strips markdown from item.text when _text has markdown", () => {
    const linkId = "item-1";
    const markdown = "This is **bold** and *italic* text";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, markdown),
    ]);

    const state = mapToTreeState(main);
    expect(state.qItems[linkId].text).not.toContain("**");
    expect(state.qItems[linkId].text).not.toContain("*");
    expect(state.qItems[linkId].text).toContain("bold");
    expect(state.qItems[linkId].text).toContain("italic");
  });

  it("strips markdown from translation text on import", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, "Norsk **tekst**"),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdownText(linkId, "English **text**"),
    ]);

    const result = translateQuestionnaire(main, translation);
    expect(result.items[linkId].text).not.toContain("**");
    expect(result.items[linkId].text).toContain("English");
    expect(result.items[linkId].text).toContain("text");
    expect(result.items[linkId].markdown).toBe("English **text**");
  });

  it("strips malformed markdown from translation text on import", () => {
    const linkId = "item-1";
    const malformed = "## asdad**asdasd*asdasd***\n\n### asdadasd";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, malformed),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdownText(linkId, malformed),
    ]);

    const result = translateQuestionnaire(main, translation);
    expect(result.items[linkId].text).not.toContain("**");
    expect(result.items[linkId].text).not.toContain("*");
    expect(result.items[linkId].text).not.toContain("#");
  });
});

describe("translateQuestionnaire with sublabel", () => {
  function createItemWithSublabel(
    linkId: string,
    text: string,
    markdown: string,
    sublabelMarkdown: string,
  ) {
    return {
      ...createItemWithMarkdown(linkId, text, markdown),
      extension: [
        { url: IExtensionType.sublabel, valueMarkdown: sublabelMarkdown },
        {
          url: IExtensionType.sublabelString,
          valueString: markdownToPlainText(sublabelMarkdown),
        },
      ],
    };
  }

  it("stores sublabel markdown in translation state", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithSublabel(
        linkId,
        "Norsk",
        "**Norsk**",
        "Norsk **sublabel**",
      ),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithSublabel(
        linkId,
        "English",
        "**English**",
        "English **sublabel**",
      ),
    ]);

    const result = translateQuestionnaire(main, translation);

    expect(result.items[linkId].sublabel).toBe("English **sublabel**");
    expect(result.items[linkId].text).not.toContain("**");
    expect(result.items[linkId].markdown).toBe("**English**");
  });
});
