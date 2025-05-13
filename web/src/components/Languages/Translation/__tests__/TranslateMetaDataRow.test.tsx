import { render, screen } from "@testing-library/react";
import TranslateMetaDataRow from "../TranslateMetaDataRow";
import { TranslatableMetadataProperty } from "src/types/LanguageTypes";
import { translatableMetadata } from "src/helpers/LanguageHelper";
import { TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import { ValidationError } from "src/utils/validationUtils";
import { ErrorLevel } from "src/helpers/validation/validationTypes";

describe("TranslateMetaDataRow", () => {
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

  describe("Url", () => {
    it("shows url section", () => {
      const url = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.url,
      )[0];
      const metadata = { url: "Test", id: "1" } as IQuestionnaireMetadata;

      render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={url}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage="en-GB"
          validationErrors={[]}
        />,
      );

      expect(screen.getByText("Url")).toBeInTheDocument();
    });

    it("shows warning validation feil", () => {
      const url = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.url,
      )[0];
      const metadata = { url: "Test", id: "1" } as IQuestionnaireMetadata;
      const validationError = {
        errorProperty: IQuestionnaireMetadataType.url,
        errorLevel: ErrorLevel.warning,
        errorReadableText:
          "In case of Helsenorge this field must be 'Questionnaire/<Id>'",
      } as ValidationError;

      const { container } = render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={url}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage="en-GB"
          validationErrors={[validationError]}
        />,
      );

      expect(
        container.getElementsByClassName("validation-warning").length,
      ).toBe(1);
      expect(container.getElementsByClassName("msg-warning").length).toBe(1);
      expect(
        screen.getByText(
          "In case of Helsenorge this field must be 'Questionnaire/<Id>'",
        ),
      ).toBeInTheDocument();
    });

    it("shows error validation feil", () => {
      const url = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.url,
      )[0];
      const metadata = {
        url: "Questionnaire/2",
        id: "1",
      } as IQuestionnaireMetadata;
      const validationError = {
        errorProperty: IQuestionnaireMetadataType.url,
        errorLevel: ErrorLevel.error,
        errorReadableText: "Url must be 'Questionnaire/<Id>'",
      } as ValidationError;

      const { container } = render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={url}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage="en-GB"
          validationErrors={[validationError]}
        />,
      );

      expect(container.getElementsByClassName("validation-error").length).toBe(
        1,
      );
      expect(container.getElementsByClassName("msg-error").length).toBe(1);
      expect(
        screen.getByText("Url must be 'Questionnaire/<Id>'"),
      ).toBeInTheDocument();
    });
  });

  describe("Title", () => {
    it("shows title section", () => {
      const title = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.title,
      )[0];
      const metadata = { title: "Test" } as IQuestionnaireMetadata;

      render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={title}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage="en-GB"
          validationErrors={[]}
        />,
      );

      expect(screen.getByText("Tittel")).toBeInTheDocument();
    });

    it("shows as error without error text, when title has no value", () => {
      const title = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.title,
      )[0];
      const metadata = {} as IQuestionnaireMetadata;

      const { container } = render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={title}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage="en-GB"
          validationErrors={[]}
        />,
      );

      expect(screen.getByText("Tittel")).toBeInTheDocument();
      expect(container.getElementsByClassName("validation-error").length).toBe(
        1,
      );
      expect(container.getElementsByClassName("msg-error").length).not.toBe(1);
    });
  });
});
