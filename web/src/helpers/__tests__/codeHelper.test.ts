import { QuestionnaireItem } from "fhir/r4";
import { describe, it, expect, vi } from "vitest";

import { removeItemCode, removeItemCodeWithCode } from "../codeHelper";
import { IItemProperty } from "src/types/IQuestionnareItemType";
describe("codeHelper", () => {
  describe("removeItemCode", () => {
    it("should not remove code if index is undefined", () => {
      const item: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
      };
      const dispatch = vi.fn();

      removeItemCode(item, "http://example.org", dispatch);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it("should not remove code if index is -1", () => {
      const item: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        code: [
          {
            system: "http://example.com",
            code: "code1",
          },
        ],
      };
      const dispatch = vi.fn();

      removeItemCode(item, "http://example.org", dispatch);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it("should remove code if index is 1", () => {
      const item: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        code: [
          {
            system: "http://example.com",
            code: "code1",
          },
          {
            system: "http://example.com",
            code: "code2",
          },
        ],
      };
      const dispatch = vi.fn();

      removeItemCodeWithCode(item, "http://example.com", "code2", dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "deleteItemCode",
        linkId: item.linkId,
        index: 1,
      });
    });

    it("should remove all codes with the same systemUrl", () => {
      const item: QuestionnaireItem = {
        linkId: "123",
        type: "choice",
        code: [
          {
            system: "http://example.com",
            code: "code1",
          },
          {
            system: "http://example.com",
            code: "code2",
          },
          {
            system: "http://example.org",
            code: "code3",
          },
        ],
      };
      const dispatch = vi.fn();

      removeItemCode(item, "http://example.com", dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "updateItem",
        linkId: item.linkId,
        itemProperty: IItemProperty.code,
        itemValue: [
          {
            system: "http://example.org",
            code: "code3",
          },
        ],
      });
    });
  });
});
