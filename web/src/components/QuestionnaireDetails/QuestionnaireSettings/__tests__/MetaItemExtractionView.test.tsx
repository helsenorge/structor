import { fireEvent, render, screen } from "src/tests/testUtils";

import QuestionnaireSettings from "../../QuestionnaireSettings";
import MetaItemExtractionContextView from "../MetaItemExtractionView";

describe("QuestionnaireSettings", () => {
  describe("MetaItemExtractionContextView", () => {
    it("ItemExtraction exists", () => {
      render(<QuestionnaireSettings questionnaireDetailsErrors={[]} />);

      // Expand the accordion to show the content
      const accordionButton = screen.getByRole("button", {
        name: "Questionnaire settings",
      });
      fireEvent.click(accordionButton);

      // The MetaItemExtractionContextView uses FormField with label "Item Extraction"
      expect(screen.getByText("Item Extraction")).toBeInTheDocument();
    });

    it("ItemExtraction default is <Not set>", () => {
      render(<MetaItemExtractionContextView />);

      expect(screen.getByTestId("radioBtn-Not set")).toHaveProperty("checked");
    });
  });
});
