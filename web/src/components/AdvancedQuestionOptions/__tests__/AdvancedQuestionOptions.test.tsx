import { render, screen } from "@testing-library/react";
import { Extension, QuestionnaireItem } from "fhir/r4";
import { vi } from "vitest";

import {
  IExtensionType,
  ItemExtractionContext,
} from "../../../types/IQuestionnareItemType";

import AdvancedQuestionOptions from "../AdvancedQuestionOptions";
import { ItemControlType } from "src/helpers/itemControl";
import { ErrorLevel } from "src/components/Validation/validationTypes";

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

describe("AdvancedQuestionOptions", () => {
  const item: QuestionnaireItem = {
    linkId: "123",
    type: "choice",
  };

  describe("ItemExtractionContextView", () => {
    it("ItemExtraction and Definition componenets exists", () => {
      render(
        <AdvancedQuestionOptions
          item={item}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[]}
          getItem={vi.fn()}
        />,
      );

      expect(screen.queryAllByAltText("Definition")).toBeTruthy();
      expect(screen.queryAllByAltText("Item Extraction")).toBeTruthy();
    });

    it("ItemExtraction default is <Not set>", () => {
      render(
        <AdvancedQuestionOptions
          item={item}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[]}
          getItem={vi.fn()}
        />,
      );

      expect(screen.getByTestId("radioBtn-Not set")).toHaveProperty("checked");
    });

    it("Item has Observation extesion", () => {
      const observationItem: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        extension: [
          {
            url: IExtensionType.itemExtractionContext,
            valueUri: ItemExtractionContext.observation,
          },
        ] as Extension[],
      };

      render(
        <AdvancedQuestionOptions
          item={observationItem}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[]}
          getItem={vi.fn()}
        />,
      );

      expect(screen.getByTestId("radioBtn-Observation")).toHaveProperty(
        "checked",
      );
    });

    it("Click Item Extraction ServiceRequest", async () => {
      const newItem: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        extension: [
          {
            url: IExtensionType.itemExtractionContext,
            valueUri: ItemExtractionContext.serviceRequest,
          },
        ] as Extension[],
      };

      render(
        <AdvancedQuestionOptions
          item={newItem}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[]}
          getItem={vi.fn()}
        />,
      );

      expect(screen.getByTestId("radioBtn-ServiceRequest")).toHaveProperty(
        "checked",
      );
    });

    it("Click Item Extraction Organizaiton", async () => {
      const newItem: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        extension: [
          {
            url: IExtensionType.itemExtractionContext,
            valueUri: ItemExtractionContext.organization,
          },
        ] as Extension[],
      };

      render(
        <AdvancedQuestionOptions
          item={newItem}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[]}
          getItem={vi.fn()}
        />,
      );

      expect(screen.getByTestId("radioBtn-Organization")).toHaveProperty(
        "checked",
      );
    });

    it("Show red frame around data-receiver when it has validation error", () => {
      const newItem: QuestionnaireItem = {
        linkId: "123",
        type: "string",
        extension: [
          {
            url: IExtensionType.itemControl,
            valueCodeableConcept: {
              coding: [
                {
                  system: IExtensionType.copyExpression,
                  code: ItemControlType.dataReceiver,
                },
              ],
            },
          },
          {
            url: IExtensionType.copyExpression,
            valueString:
              "QuestionnaireResponse.descendants().where(linkId='text-1').answer.value",
          },
        ] as Extension[],
      };

      const { container } = render(
        <AdvancedQuestionOptions
          item={newItem}
          parentArray={[]}
          conditionalArray={[]}
          itemValidationErrors={[
            {
              linkId: "123",
              errorProperty: ItemControlType.dataReceiver,
              errorReadableText:
                "data receiver does not have an earlier question",
              errorLevel: ErrorLevel.error,
            },
          ]}
          getItem={vi.fn()}
        />,
      );

      expect(
        container.getElementsByClassName("error-highlight-box"),
      ).exist.toBeTruthy();
    });
  });
});
