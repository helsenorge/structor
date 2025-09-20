import { render, screen } from "@testing-library/react";
import TranslateMetaData from "../TranslateMetaData";
import { TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";

describe("TranslateMetaData", () => {
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
        t: (i18nKey: any) => i18nKey,
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

  it("finds all the translatable variables", () => {
    const metadata = { title: "Test", id: "1" } as IQuestionnaireMetadata;
    render(
      <TranslateMetaData
        dispatch={vi.fn()}
        state={{ qMetadata: metadata } as TreeState}
        targetLanguage="en-GB"
        validationErrors={[]}
      />,
    );

    expect(screen.getByText("Tittel")).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Url")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Publisher")).toBeInTheDocument();
    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.getByText("Copyright")).toBeInTheDocument();
  });

  it("shows the header", () => {
    const metadata = { title: "Test", id: "1" } as IQuestionnaireMetadata;
    render(
      <TranslateMetaData
        dispatch={vi.fn()}
        state={{ qMetadata: metadata } as TreeState}
        targetLanguage="en-GB"
        validationErrors={[]}
      />,
    );

    expect(screen.getByText("Questionnaire details")).toBeInTheDocument();
  });
});
