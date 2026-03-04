import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorLevel } from "src/components/Validation/validationTypes";
import { translatableMetadata } from "src/helpers/LanguageHelper";
import {
  type IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import {
  ExtendedLanguageLocales,
  TranslatableMetadataProperty,
} from "src/types/LanguageTypes";

import type {
  Languages,
  MetadataTranslations,
  Translation,
  TreeState,
} from "src/store/treeStore/treeStore";
import type { ValidationError } from "src/utils/validationUtils";

import TranslateMetaDataRow from "../TranslateMetaDataRow";

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
      const metadata = {
        url: "Original Test",
        id: "1",
      } as IQuestionnaireMetadata;
      const languages = {
        "en-GB": {
          metaData: { url: "Test English" } as MetadataTranslations,
        } as Translation,
      } as Languages;
      render(
        <TranslateMetaDataRow
          dispatch={vi.fn()}
          metadataProperty={url}
          state={
            {
              qMetadata: metadata,
              qAdditionalLanguages: languages,
            } as TreeState
          }
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
          validationErrors={[]}
        />,
      );

      expect(screen.getByText("Url")).toBeInTheDocument();
      expect(screen.getByText("Original Test")).toBeInTheDocument();
      expect(screen.getByText("Test English")).toBeInTheDocument();
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
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
          validationErrors={[validationError]}
        />,
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("warning-highlight").length).toBe(
        1,
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("warning-text").length).toBe(1);
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
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
          validationErrors={[validationError]}
        />,
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("error-highlight").length).toBe(
        1,
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("error-text").length).toBe(1);
      expect(
        screen.getByText("Url must be 'Questionnaire/<Id>'"),
      ).toBeInTheDocument();
    });

    it("calls Update on blur with the new input and related propertyname", async () => {
      const dispatchMock = vi.fn();
      const url = translatableMetadata.filter(
        (f) => f.propertyName === TranslatableMetadataProperty.url,
      )[0];
      const metadata = {} as IQuestionnaireMetadata;

      render(
        <TranslateMetaDataRow
          dispatch={dispatchMock}
          metadataProperty={url}
          state={{ qMetadata: metadata } as TreeState}
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
          validationErrors={[]}
        />,
      );

      const input = screen.getAllByPlaceholderText("Enter translation..");
      await userEvent.type(input[0], "Testing");
      await userEvent.tab(); // blur

      expect(dispatchMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: "updateMetadataTranslation" }),
        ]),
      );
      expect(dispatchMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            languageCode: ExtendedLanguageLocales.ENGLISH,
          }),
        ]),
      );
      expect(dispatchMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ translation: "Testing" }),
        ]),
      );
      expect(dispatchMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: TranslatableMetadataProperty.url,
          }),
        ]),
      );
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
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
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
          targetLanguage={ExtendedLanguageLocales.ENGLISH}
          validationErrors={[]}
        />,
      );

      expect(screen.getByText("Tittel")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("error-highlight").length).toBe(
        1,
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.getElementsByClassName("error-text").length).not.toBe(1);
    });
  });
});
