import { render, screen } from "src/tests/testUtils";
import QuestionnaireSettings from "../../QuestionnaireSettings";
import MetaItemExtractionContextView from "../MetaItemExtractionView";

describe("QuestionnaireSettings", () => {
  describe("MetaItemExtractionContextView", () => {
    it("ItemExtraction exists", () => {
      render(<QuestionnaireSettings questionnaireDetailsErrors={[]} />);

      expect(screen.queryAllByAltText("Item Extraction")).toBeTruthy();
    });

    it("ItemExtraction default is <Not set>", () => {
      render(<MetaItemExtractionContextView />);

      expect(screen.getByTestId("radioBtn-Not set")).toHaveProperty("checked");
    });
  });
});
