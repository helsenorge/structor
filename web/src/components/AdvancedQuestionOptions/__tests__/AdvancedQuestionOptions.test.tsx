import { render, screen } from "@testing-library/react";
import { Extension, QuestionnaireItem } from "fhir/r4";
import { vi } from "vitest";

import {
  IExtensionType,
  ItemExtractionContext,
} from "../../../types/IQuestionnareItemType";

import AdvancedQuestionOptions from "../AdvancedQuestionOptions";

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
          getItem={vi.fn()}
        />,
      );

      expect(screen.getByTestId("radioBtn-Organization")).toHaveProperty(
        "checked",
      );
    });
  });
});
