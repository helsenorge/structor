import { describe, beforeAll, it, expect } from "vitest";

import type { TreeState } from "../../store/treeStore/treeStore";
import { IExtensionType } from "../../types/IQuestionnareItemType";
import type { Bundle, Questionnaire, QuestionnaireItem } from "fhir/r4";

import { getInitialState } from "../../store/treeStore/initialState";
import { mapToTreeState } from "../FhirToTreeStateMapper";
import { generateQuestionnaire } from "../generateQuestionnaire";
import { markdownToPlainText } from "../markdownToPlainText";

describe(`generateQuestionnaire from initialState`, () => {
  let generatedQuestionnaire: Questionnaire;
  beforeAll(() => {
    const result = generateQuestionnaire(getInitialState());
    generatedQuestionnaire = JSON.parse(result);
  });
  it(`removes empty string properties`, () => {
    expect(generatedQuestionnaire).not.toHaveProperty("title");
  });

  it("does not remove string properties", () => {
    expect(generatedQuestionnaire).toHaveProperty(
      "resourceType",
      "Questionnaire",
    );
  });

  it(`does not remove populated arrays`, () => {
    expect(generatedQuestionnaire).toHaveProperty("subjectType", ["Patient"]);
  });
});

describe(`generateQuestionnaire from state with items`, () => {
  let generatedQuestionnaire: Questionnaire;
  beforeAll(() => {
    const linkId1 = "12345";
    const linkId2 = "67890";
    const state: TreeState = {
      ...getInitialState(),
      qItems: {
        [linkId1]: { linkId: linkId1, type: "group", _text: {} },
        [linkId2]: { linkId: linkId2, type: "group", _text: { extension: [] } },
      },
      qOrder: [
        { linkId: linkId1, items: [] },
        { linkId: linkId2, items: [] },
      ],
    };
    const result = generateQuestionnaire(state);
    generatedQuestionnaire = JSON.parse(result);
  });

  it(`removes empty objects`, () => {
    const item = generatedQuestionnaire.item
      ? generatedQuestionnaire.item[0]
      : undefined;
    expect(item).not.toHaveProperty("_text");
  });

  it(`does not remove populated objects`, () => {
    const item = generatedQuestionnaire.item
      ? generatedQuestionnaire.item[1]
      : undefined;
    expect(item).toHaveProperty("_text");
  });
});

// --- Sublabel & markdown helpers ---

const MARKDOWN_URL =
  "http://hl7.org/fhir/StructureDefinition/rendering-markdown";

function createItemWithSublabel(
  linkId: string,
  text: string,
  markdown: string,
  sublabelMarkdown: string,
): QuestionnaireItem {
  return {
    linkId,
    type: "string",
    text,
    required: false,
    _text: {
      extension: [{ url: MARKDOWN_URL, valueMarkdown: markdown }],
    },
    extension: [
      { url: IExtensionType.sublabel, valueMarkdown: sublabelMarkdown },
      {
        url: IExtensionType.sublabelString,
        valueString: markdownToPlainText(sublabelMarkdown),
      },
    ],
  };
}

function createItemPlainText(
  linkId: string,
  text: string,
  sublabelText?: string,
): QuestionnaireItem {
  const item: QuestionnaireItem = {
    linkId,
    type: "string",
    text,
    required: false,
  };
  if (sublabelText) {
    item.extension = [
      { url: IExtensionType.sublabel, valueMarkdown: sublabelText },
      { url: IExtensionType.sublabelString, valueString: sublabelText },
    ];
  }
  return item;
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

function createBundle(main: Questionnaire, translation: Questionnaire): Bundle {
  return {
    resourceType: "Bundle",
    type: "searchset",
    total: 2,
    entry: [{ resource: main }, { resource: translation }],
  };
}

function findExtension(
  item: QuestionnaireItem,
  url: string,
): { valueMarkdown?: string; valueString?: string } | undefined {
  return item.extension?.find((e) => e.url === url);
}

function createItemWithMarkdownText(
  linkId: string,
  markdown: string,
): QuestionnaireItem {
  return {
    linkId,
    type: "string",
    text: markdownToPlainText(markdown),
    required: false,
    _text: {
      extension: [{ url: MARKDOWN_URL, valueMarkdown: markdown }],
    },
  };
}

function createHelpChildItem(
  linkId: string,
  helpMarkdown: string,
): QuestionnaireItem {
  return {
    linkId,
    type: "display",
    text: markdownToPlainText(helpMarkdown),
    required: false,
    _text: {
      extension: [{ url: MARKDOWN_URL, valueMarkdown: helpMarkdown }],
    },
    extension: [
      {
        url: IExtensionType.itemControl,
        valueCodeableConcept: {
          coding: [
            {
              system: "http://hl7.org/fhir/ValueSet/questionnaire-item-control",
              code: "help",
            },
          ],
        },
      },
    ],
  };
}

function createItemWithHelpText(
  linkId: string,
  text: string,
  markdown: string,
  helpLinkId: string,
  helpMarkdown: string,
): QuestionnaireItem {
  return {
    ...createItemWithMarkdownText(linkId, markdown),
    text,
    item: [createHelpChildItem(helpLinkId, helpMarkdown)],
  };
}

// --- Sublabel extension tests ---

describe("sublabel extensions in generateQuestionnaire", () => {
  it("preserves both sdf-sublabel and sdf-sublabel-text on main questionnaire", () => {
    const linkId = "item-1";
    const sublabelMd = "This is **bold** sublabel";
    const item = createItemWithSublabel(linkId, "Test", "*Test*", sublabelMd);

    const state: TreeState = {
      ...getInitialState(),
      qItems: { [linkId]: item },
      qOrder: [{ linkId, items: [] }],
    };

    const result = JSON.parse(generateQuestionnaire(state)) as Questionnaire;
    const outputItem = result.item![0];

    const sublabelExt = findExtension(outputItem, IExtensionType.sublabel);
    const sublabelTextExt = findExtension(
      outputItem,
      IExtensionType.sublabelString,
    );

    expect(sublabelExt?.valueMarkdown).toBe(sublabelMd);
    expect(sublabelTextExt?.valueString).toBe("This is bold sublabel");
    expect(sublabelTextExt?.valueString).not.toContain("**");
  });

  it("preserves sublabel on plain text items (no markdown toggle)", () => {
    const linkId = "item-1";
    const item = createItemPlainText(linkId, "Plain item", "Plain sublabel");

    const state: TreeState = {
      ...getInitialState(),
      qItems: { [linkId]: item },
      qOrder: [{ linkId, items: [] }],
    };

    const result = JSON.parse(generateQuestionnaire(state)) as Questionnaire;
    const outputItem = result.item![0];

    const sublabelExt = findExtension(outputItem, IExtensionType.sublabel);
    const sublabelTextExt = findExtension(
      outputItem,
      IExtensionType.sublabelString,
    );

    expect(sublabelExt?.valueMarkdown).toBe("Plain sublabel");
    expect(sublabelTextExt?.valueString).toBe("Plain sublabel");
  });
});

describe("sublabel extensions in translated questionnaire", () => {
  it("translates both sdf-sublabel and sdf-sublabel-text", () => {
    const linkId = "item-1";
    const nbSublabel = "Norsk **sublabel**";
    const enSublabel = "English **sublabel**";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithSublabel(linkId, "Norsk", "**Norsk**", nbSublabel),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithSublabel(linkId, "English", "**English**", enSublabel),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0];

    const sublabelExt = findExtension(translatedItem, IExtensionType.sublabel);
    const sublabelTextExt = findExtension(
      translatedItem,
      IExtensionType.sublabelString,
    );

    expect(sublabelExt?.valueMarkdown).toBeDefined();
    expect(sublabelTextExt?.valueString).toBeDefined();
    expect(sublabelTextExt?.valueString).not.toContain("**");
  });

  it("translated item.text does not contain markdown when _text exists", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithSublabel(
        linkId,
        "Norsk tekst",
        "Norsk **markdown**",
        "sublabel",
      ),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithSublabel(
        linkId,
        "English text",
        "English **markdown**",
        "sublabel",
      ),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0];

    expect(translatedItem.text).not.toContain("**");
    expect(translatedItem.text).toContain("English");
  });
});

describe("backward compatibility: old questionnaires without sdf-sublabel-text", () => {
  it("loads old questionnaire with only sdf-sublabel extension", () => {
    const linkId = "item-1";
    const item: QuestionnaireItem = {
      linkId,
      type: "string",
      text: "Old item",
      required: false,
      extension: [
        { url: IExtensionType.sublabel, valueMarkdown: "Old **sublabel**" },
      ],
    };

    const q = createMinimalQuestionnaire("nb-NO", [item]);
    const state = mapToTreeState(q);

    expect(state.qItems[linkId]).toBeDefined();
    expect(state.qItems[linkId].extension).toHaveLength(1);
    expect(state.qItems[linkId].extension![0].url).toBe(
      IExtensionType.sublabel,
    );
    expect(state.qItems[linkId].extension![0].valueMarkdown).toBe(
      "Old **sublabel**",
    );
  });

  it("preserves old sdf-sublabel on round-trip without sdf-sublabel-text", () => {
    const linkId = "item-1";
    const item: QuestionnaireItem = {
      linkId,
      type: "string",
      text: "Old item",
      required: false,
      extension: [
        { url: IExtensionType.sublabel, valueMarkdown: "Old sublabel text" },
      ],
    };

    const q = createMinimalQuestionnaire("nb-NO", [item]);
    const state = mapToTreeState(q);
    const output = JSON.parse(generateQuestionnaire(state)) as Questionnaire;
    const outputItem = output.item![0];

    const sublabelExt = findExtension(outputItem, IExtensionType.sublabel);
    expect(sublabelExt?.valueMarkdown).toBe("Old sublabel text");
  });
});

describe("round-trip: full questionnaire with sublabels and translations", () => {
  it("preserves all extensions through load → save cycle", () => {
    const groupLinkId = "group-1";
    const itemLinkId = "item-1";
    const nbSublabel = "Norsk **sublabel** med [lenke](https://nhn.no)";
    const enSublabel = "English **sublabel** with [link](https://nhn.no)";

    const main = createMinimalQuestionnaire("nb-NO", [
      {
        linkId: groupLinkId,
        type: "group" as const,
        text: "Gruppe",
        required: false,
        item: [
          createItemWithSublabel(
            itemLinkId,
            "Norsk tekst",
            "Norsk **markdown**",
            nbSublabel,
          ),
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
          createItemWithSublabel(
            itemLinkId,
            "English text",
            "English **markdown**",
            enSublabel,
          ),
        ],
      },
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    expect(output.resourceType).toBe("Bundle");
    expect(output.entry).toHaveLength(2);

    const mainQ = output.entry![0].resource as Questionnaire;
    const mainItem = mainQ.item![0].item![0];

    const mainSublabel = findExtension(mainItem, IExtensionType.sublabel);
    const mainSublabelText = findExtension(
      mainItem,
      IExtensionType.sublabelString,
    );
    const mainMarkdown = mainItem._text?.extension?.find(
      (e) => e.url === MARKDOWN_URL,
    );

    expect(mainSublabel?.valueMarkdown).toBe(nbSublabel);
    expect(mainSublabelText?.valueString).not.toContain("**");
    expect(mainSublabelText?.valueString).not.toContain("[");
    expect(mainSublabelText?.valueString).toContain("Norsk");
    expect(mainSublabelText?.valueString).toContain("sublabel");
    expect(mainMarkdown?.valueMarkdown).toBe("Norsk **markdown**");

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0].item![0];

    const trSublabel = findExtension(translatedItem, IExtensionType.sublabel);
    const trSublabelText = findExtension(
      translatedItem,
      IExtensionType.sublabelString,
    );
    const trMarkdown = translatedItem._text?.extension?.find(
      (e) => e.url === MARKDOWN_URL,
    );

    expect(trSublabel?.valueMarkdown).toBeDefined();
    expect(trSublabelText?.valueString).toBeDefined();
    expect(trSublabelText?.valueString).not.toContain("**");
    expect(trSublabelText?.valueString).not.toContain("[");
    expect(trMarkdown?.valueMarkdown).toBeDefined();
    expect(translatedItem.text).not.toContain("**");
  });
});

describe("help text items with markdown", () => {
  it("preserves help item _text markdown and plain text on round-trip", () => {
    const parentLinkId = "parent-1";
    const helpLinkId = "help-1";
    const helpMd = "This is **help** with [link](https://nhn.no)";

    const item = createItemWithHelpText(
      parentLinkId,
      "Parent",
      "**Parent**",
      helpLinkId,
      helpMd,
    );

    const state: TreeState = {
      ...getInitialState(),
      qItems: {
        [parentLinkId]: { ...item, item: undefined },
        [helpLinkId]: item.item![0],
      },
      qOrder: [
        { linkId: parentLinkId, items: [{ linkId: helpLinkId, items: [] }] },
      ],
    };

    const result = JSON.parse(generateQuestionnaire(state)) as Questionnaire;
    const helpItem = result.item![0].item![0];

    const helpMarkdown = helpItem._text?.extension?.find(
      (e) => e.url === MARKDOWN_URL,
    );
    expect(helpMarkdown?.valueMarkdown).toBe(helpMd);
    expect(helpItem.text).not.toContain("**");
    expect(helpItem.text).not.toContain("[");
    expect(helpItem.text).toContain("help");
  });

  it("translates help item text and strips markdown", () => {
    const parentLinkId = "parent-1";
    const helpLinkId = "help-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithHelpText(
        parentLinkId,
        "Forelder",
        "**Forelder**",
        helpLinkId,
        "Norsk **hjelp**",
      ),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithHelpText(
        parentLinkId,
        "Parent",
        "**Parent**",
        helpLinkId,
        "English **help**",
      ),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedHelp = translatedQ.item![0].item![0];

    expect(translatedHelp.text).not.toContain("**");

    const helpMarkdown = translatedHelp._text?.extension?.find(
      (e) => e.url === MARKDOWN_URL,
    );
    expect(helpMarkdown?.valueMarkdown).toBeDefined();
  });
});

describe("malformed sublabel markdown in translation", () => {
  it("strips malformed markdown from sdf-sublabel-text in translated output", () => {
    const linkId = "item-1";
    const malformedSublabel = "## asdad**asdasd*asdasd***\n\n### asdadasd";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithSublabel(linkId, "Norsk", "**Norsk**", malformedSublabel),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithSublabel(
        linkId,
        "English",
        "**English**",
        malformedSublabel,
      ),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const mainQ = output.entry![0].resource as Questionnaire;
    const mainSublabelText = findExtension(
      mainQ.item![0],
      IExtensionType.sublabelString,
    );
    expect(mainSublabelText?.valueString).not.toContain("**");
    expect(mainSublabelText?.valueString).not.toContain("*");
    expect(mainSublabelText?.valueString).not.toContain("#");

    const translatedQ = output.entry![1].resource as Questionnaire;
    const trSublabelText = findExtension(
      translatedQ.item![0],
      IExtensionType.sublabelString,
    );
    expect(trSublabelText?.valueString).not.toContain("**");
    expect(trSublabelText?.valueString).not.toContain("*");
    expect(trSublabelText?.valueString).not.toContain("#");
  });

  it("strips malformed markdown from item.text in translated output", () => {
    const linkId = "item-1";
    const malformedMd = "**bold*nested***extra";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, malformedMd),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdownText(linkId, malformedMd),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0];

    expect(translatedItem.text).not.toContain("**");
    expect(translatedItem.text).not.toContain("*");
  });
});

// --- FHIR R4: rendering-markdown extension must always have valueMarkdown ---

describe("FHIR R4: _text rendering-markdown extension integrity", () => {
  it("never produces _text.extension with rendering-markdown but no valueMarkdown", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, "Norsk **tekst**"),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      createItemWithMarkdownText(linkId, "English **text**"),
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    for (const entry of output.entry!) {
      const q = entry.resource as Questionnaire;
      for (const item of q.item!) {
        const markdownExt = item._text?.extension?.find(
          (e) => e.url === MARKDOWN_URL,
        );
        if (markdownExt) {
          expect(markdownExt.valueMarkdown).toBeDefined();
          expect(markdownExt.valueMarkdown).not.toBe("");
        }
      }
    }
  });

  it("does not emit _text when translation has no markdown", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      { linkId, type: "string", text: "Vanlig tekst", required: false },
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      { linkId, type: "string", text: "Plain text", required: false },
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;

    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0];

    // No _text on main item means no _text on translated item
    expect(translatedItem._text).toBeUndefined();
  });

  it("handles translation where main has markdown but translation valueMarkdown is missing", () => {
    const linkId = "item-1";

    // Main has proper markdown
    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, "Norsk **markdown**"),
    ]);
    // Translation has the extension URL but valueMarkdown is missing (the bug scenario)
    const translation = createMinimalQuestionnaire("en-GB", [
      {
        linkId,
        type: "string" as const,
        text: "English text",
        required: false,
        _text: {
          extension: [{ url: MARKDOWN_URL }],
        },
      },
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);

    // The mapper should have recovered the markdown from text
    const enTranslation = state.qAdditionalLanguages?.["en-GB"];
    expect(enTranslation?.items[linkId].markdown).toBe("English text");
    expect(enTranslation?.items[linkId].text).toBe("English text");

    // Round-trip: output should have valid valueMarkdown
    const output = JSON.parse(generateQuestionnaire(state)) as Bundle;
    const translatedQ = output.entry![1].resource as Questionnaire;
    const translatedItem = translatedQ.item![0];
    const markdownExt = translatedItem._text?.extension?.find(
      (e) => e.url === MARKDOWN_URL,
    );

    if (markdownExt) {
      expect(markdownExt.valueMarkdown).toBeDefined();
      expect(markdownExt.valueMarkdown).not.toBe("");
    }
  });

  it("handles translation where main has markdown but translation has empty valueMarkdown", () => {
    const linkId = "item-1";

    const main = createMinimalQuestionnaire("nb-NO", [
      createItemWithMarkdownText(linkId, "Norsk **markdown**"),
    ]);
    const translation = createMinimalQuestionnaire("en-GB", [
      {
        linkId,
        type: "string" as const,
        text: "English text",
        required: false,
        _text: {
          extension: [{ url: MARKDOWN_URL, valueMarkdown: "" }],
        },
      },
    ]);

    const bundle = createBundle(main, translation);
    const state = mapToTreeState(bundle);

    // Mapper should fall back to item.text
    const enTranslation = state.qAdditionalLanguages?.["en-GB"];
    expect(enTranslation?.items[linkId].markdown).toBe("English text");
  });
});
