import { QuestionnaireItem } from "fhir/r4";
import { describe, it, expect } from "vitest";

import { hiddenItem, itemWithRenderOption } from "../../__data__/items";
import { RenderingOptionsEnum } from "../codeHelper";
import { isHiddenItem } from "../QuestionHelper";

describe("QuestionHelper", () => {
  describe("isHiddenItem", () => {
    it("Item is hidden, returns true", () => {
      const result = isHiddenItem(hiddenItem as QuestionnaireItem);
      expect(result).toBeTruthy();
    });

    it("Item is shows only in PDF, returns false", () => {
      const result = isHiddenItem(
        itemWithRenderOption(RenderingOptionsEnum.KunPdf),
      );
      expect(result).toBeFalsy();
    });

    it("Item is shows only in form, returns false", () => {
      const result = isHiddenItem(
        itemWithRenderOption(RenderingOptionsEnum.KunSkjemautfyller),
      );
      expect(result).toBeFalsy();
    });

    it("Item with default render option, returns false", () => {
      const result = isHiddenItem(
        itemWithRenderOption(RenderingOptionsEnum.Default),
      );
      expect(result).toBeFalsy();
    });
  });
});
