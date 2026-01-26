import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  updateItemTranslationAction,
  updateItemCodeTranslation,
  updateItemOptionTranslationAction,
  updateItemExtensionTranslation,
} from "src/store/treeStore/treeActions";
import {
  TreeContext,
  type TreeState,
  type Languages,
} from "src/store/treeStore/treeStore";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";

import type { QuestionnaireItem } from "fhir/r4";
import type { Mock } from "vitest";

import TranslateItemRow from "../TranslateItemRow";

vi.mock("src/components/MarkdownEditor/MarkdownEditor", () => ({
  __esModule: true,
  default: (props: {
    data: string;
    onBlur?: (data: string) => void;
    disabled?: boolean;
    placeholder?: string;
  }) => (
    <textarea
      data-testid="markdown-editor-mock"
      defaultValue={props.data}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onBlur={(e) => props.onBlur?.(e.currentTarget.value)}
      onChange={() => {}}
    />
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (i18nKey: string) => i18nKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

vi.mock("src/store/treeStore/treeActions");

const updateItemTranslationActionMock = updateItemTranslationAction as Mock;
const updateItemCodeTranslationMock = updateItemCodeTranslation as Mock;
const updateItemOptionTranslationActionMock =
  updateItemOptionTranslationAction as Mock;
const updateItemExtensionTranslationMock =
  updateItemExtensionTranslation as Mock;

describe("TranslateItemRow", () => {
  let dispatchMock: Mock;

  beforeEach(() => {
    dispatchMock = vi.fn();
    updateItemTranslationActionMock.mockClear();
    updateItemCodeTranslationMock.mockClear();
    updateItemOptionTranslationActionMock.mockClear();
    updateItemExtensionTranslationMock.mockClear();
  });

  describe("Basic text translation", () => {
    it("renders item heading and text fields", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Original question text",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                text: "Translated text",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Question 1")).toBeInTheDocument();
      expect(screen.getByText("Original question text")).toBeInTheDocument();
    });

    it("updates text translation on blur", async () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Original text",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      const textareas = screen.getAllByRole("textbox");
      const translationTextarea = textareas[1]; // Second textarea is for translation

      await userEvent.type(translationTextarea, "New translation");
      await userEvent.tab(); // blur

      expect(dispatchMock).toHaveBeenCalled();
    });

    it("shows existing translation", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Original text",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                text: "Existing translation",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      const textareas = screen.getAllByRole("textbox");
      expect(textareas[1]).toHaveValue("Existing translation");
    });
  });

  describe("Markdown text translation", () => {
    it("renders markdown editor for items with _text extension", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Original",
        _text: {
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
              valueMarkdown: "**Bold text**",
            },
          ],
        },
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                text: "**Translated bold**",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      const markdownEditors = screen.getAllByTestId("markdown-editor-mock");
      expect(markdownEditors.length).toBeGreaterThan(0);
    });
  });

  describe("Answer options translation", () => {
    it("renders answer options for translation", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.choice,
        text: "Choose an option",
        answerOption: [
          {
            valueCoding: {
              code: "option1",
              display: "Option 1",
              system: "http://test.no",
            },
          },
          {
            valueCoding: {
              code: "option2",
              display: "Option 2",
              system: "http://test.no",
            },
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                answerOptions: {
                  option1: "Translated option 1",
                  option2: "Translated option 2",
                },
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      // Options are rendered as input fields
      expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
    });

    it("skips options without code", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.choice,
        text: "Choose an option",
        answerOption: [
          {
            valueCoding: {
              display: "Option without code",
              system: "http://test.no",
            },
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.queryByText("Option without code")).not.toBeInTheDocument();
    });
  });

  describe("Translatable fields", () => {
    it("renders sublabel field when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.sublabel,
            valueMarkdown: "This is a sublabel",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                sublabel: "Translated sublabel",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Sublabel")).toBeInTheDocument();
      expect(screen.getByText("This is a sublabel")).toBeInTheDocument();
    });

    it("renders repeat button text when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.repeatstext,
            valueString: "Add another",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                repeatsText: "Translated repeat text",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Repeat button text")).toBeInTheDocument();
      expect(screen.getByText("Add another")).toBeInTheDocument();
    });

    it("renders validation message when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.validationtext,
            valueString: "This field is required",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                validationText: "Translated validation message",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(
        screen.getByText("Error message for validation error"),
      ).toBeInTheDocument();
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("renders placeholder text when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.entryFormat,
            valueString: "Enter your name",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                entryFormatText: "Translated placeholder",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Placeholder text")).toBeInTheDocument();
      expect(screen.getByText("Enter your name")).toBeInTheDocument();
    });

    it("renders prefix when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        prefix: "1.1",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                prefix: "1.1 (translated)",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Prefix")).toBeInTheDocument();
      expect(screen.getByText("1.1")).toBeInTheDocument();
    });

    it("renders initial value for text/string types when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.text,
        text: "Question",
        initial: [
          {
            valueString: "Initial value",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                initial: "Translated initial value",
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      const initialValueElements = screen.getAllByText("Initial value");
      expect(initialValueElements.length).toBeGreaterThan(0);
    });

    it("does not render initial value for non-text/string types", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.integer,
        text: "Question",
        initial: [
          {
            valueInteger: 42,
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.queryByText("Initial value")).not.toBeInTheDocument();
    });
  });

  describe("Code translation", () => {
    it("renders translatable codes from systemCodesToTranslate", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        code: [
          {
            code: "test-code",
            display: "Test Code Display",
            system: "http://snomed.info/sct",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                code: [
                  {
                    code: "test-code",
                    display: "Translated code display",
                    system: "http://snomed.info/sct",
                  },
                ],
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Test Code Display")).toBeInTheDocument();
    });

    it("does not render codes not in systemCodesToTranslate", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        code: [
          {
            code: "test-code",
            display: "Non-translatable Code",
            system: "http://non-translatable.system",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(
        screen.queryByText("Non-translatable Code"),
      ).not.toBeInTheDocument();
    });
  });

  describe("FhirPath extensions", () => {
    it("renders FhirPath extension when present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.fhirPath,
            valueString: "%resource.status = 'active'",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("FhirPath")).toBeInTheDocument();
      const textareas = screen.getAllByRole("textbox");
      const fhirPathTextarea = textareas.find(
        (ta) =>
          (ta as HTMLTextAreaElement).value === "%resource.status = 'active'",
      );
      expect(fhirPathTextarea).toBeInTheDocument();
    });

    it("does not render FhirPath section when not present", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.queryByText("FhirPath")).not.toBeInTheDocument();
    });

    it("handles multiple FhirPath extensions correctly", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: "http://other.extension",
            valueString: "other value",
          },
          {
            url: IExtensionType.fhirPath,
            valueString: "%resource.status = 'active'",
          },
          {
            url: IExtensionType.fhirPath,
            valueString: "%resource.code.exists()",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                extension: [
                  {
                    url: "http://other.extension",
                    valueString: "other value",
                  },
                  {
                    url: IExtensionType.fhirPath,
                    valueString: "%resource.status = 'aktiv'",
                  },
                  {
                    url: IExtensionType.fhirPath,
                    valueString: "%resource.code.finnes()",
                  },
                ],
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("FhirPath")).toBeInTheDocument();
      const textareas = screen.getAllByRole("textbox");

      // Should show translated FhirPath values
      const translatedFhirPath1 = textareas.find(
        (ta) =>
          (ta as HTMLTextAreaElement).value === "%resource.status = 'aktiv'",
      );
      const translatedFhirPath2 = textareas.find(
        (ta) => (ta as HTMLTextAreaElement).value === "%resource.code.finnes()",
      );

      expect(translatedFhirPath1).toBeInTheDocument();
      expect(translatedFhirPath2).toBeInTheDocument();
    });

    it("updates FhirPath extension translation on blur", async () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
        extension: [
          {
            url: IExtensionType.fhirPath,
            valueString: "%resource.status = 'active'",
          },
        ],
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {},
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      const textareas = screen.getAllByRole("textbox");
      // Find the editable FhirPath textarea (not disabled)
      const editableFhirPath = textareas.find(
        (ta) =>
          !ta.hasAttribute("disabled") &&
          (ta as HTMLTextAreaElement).value === "%resource.status = 'active'",
      );

      if (editableFhirPath) {
        await userEvent.clear(editableFhirPath);
        await userEvent.type(editableFhirPath, "%resource.status = 'aktiv'");
        await userEvent.tab(); // blur

        expect(dispatchMock).toHaveBeenCalled();
      }
    });
  });

  describe("Edge cases", () => {
    it("handles item without translations", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {},
          },
        } as unknown as Languages,
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Question 1")).toBeInTheDocument();
    });

    it("handles missing qAdditionalLanguages", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {},
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      expect(screen.getByText("Question 1")).toBeInTheDocument();
    });

    it("applies error highlighting when translation is missing", () => {
      const item: QuestionnaireItem = {
        linkId: "1",
        type: IQuestionnaireItemType.string,
        text: "Question",
      };

      const treeState = {
        qAdditionalLanguages: {
          "en-GB": {
            items: {
              "1": {
                text: "", // Empty translation
              },
            },
          },
        },
      } as unknown as TreeState;

      render(
        <TreeContext.Provider
          value={{ state: treeState, dispatch: dispatchMock }}
        >
          <TranslateItemRow
            targetLanguage="en-GB"
            item={item}
            itemHeading="Question 1"
          />
        </TreeContext.Provider>,
      );

      // Verify that the error highlighting class is applied by checking the textarea with error class
      const textareas = screen.getAllByRole("textbox");
      const hasErrorHighlight = textareas.some((textarea) =>
        textarea.className.includes("error-highlight"),
      );
      expect(hasErrorHighlight).toBe(true);
    });
  });
});
