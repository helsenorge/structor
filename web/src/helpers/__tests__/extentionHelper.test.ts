import { Element, Extension } from "fhir/r4";
import { describe, vi, it, expect, beforeEach } from "vitest";

import { ICodeSystem, IExtensionType } from "../../types/IQuestionnareItemType";

import {
  findExtensionByUrl,
  isExtensionValueTrue,
  findExtentionByCode,
  getExtensionByCodeAndElement,
  hasOneOrMoreExtensions,
} from "../extensionHelper";

describe("extentionHelper", () => {
  describe("findExtensionByUrl", () => {
    const mockExtensions: Extension[] = [
      { url: "http://example.com/ext1", valueBoolean: true },
      { url: "http://example.com/ext2", valueString: "test" },
    ];

    it("should find the correct extension by URL", () => {
      const result = findExtensionByUrl(
        mockExtensions,
        "http://example.com/ext1",
      );
      expect(result).toEqual({
        url: "http://example.com/ext1",
        valueBoolean: true,
      });
    });

    it("should return undefined if the extension is not found", () => {
      const result = findExtensionByUrl(
        mockExtensions,
        "http://example.com/nonexistent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined if extensions array is undefined", () => {
      const result = findExtensionByUrl(undefined, "http://example.com/ext1");
      expect(result).toBeUndefined();
    });
  });
  describe("isExtensionValueTrue", () => {
    const mockExtensions: Extension[] = [
      { url: "http://example.com/ext1", valueBoolean: true },
      { url: "http://example.com/ext2", valueBoolean: false },
      { url: "http://example.com/ext3", valueString: "test" },
      { url: "http://example.com/ext4", valueInteger: 42 },
    ];

    it("should return true if the extension value is true", () => {
      const result = isExtensionValueTrue(
        mockExtensions,
        "http://example.com/ext1",
        "valueBoolean",
      );
      expect(result).toBe(true);
    });

    it("should return false if the extension value is false", () => {
      const result = isExtensionValueTrue(
        mockExtensions,
        "http://example.com/ext2",
        "valueBoolean",
      );
      expect(result).toBe(false);
    });

    it("should return undefined if the extension value is not a boolean", () => {
      let result = isExtensionValueTrue(
        mockExtensions,
        "http://example.com/ext3",
        "valueString",
      );
      expect(result).toBeUndefined();

      result = isExtensionValueTrue(
        mockExtensions,
        "http://example.com/ext4",
        "valueInteger",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined if the extension is not found", () => {
      const result = isExtensionValueTrue(
        mockExtensions,
        "http://example.com/nonexistent",
        "valueBoolean",
      );
      expect(result).toBeUndefined();
    });
  });
  describe("findExtentionByCode", () => {
    const mockExtensions: Extension[] = [
      {
        url: "url1",
        valueCoding: {
          system: ICodeSystem.renderOptionsCodeSystem,
          code: "code1",
        },
      },
      {
        url: "url2",
        valueCoding: { system: ICodeSystem.choiceRenderOptions, code: "code2" },
      },
    ];

    it("should find the correct extension by code", () => {
      const result = findExtentionByCode(
        ICodeSystem.renderOptionsCodeSystem,
        mockExtensions,
      );
      expect(result).toEqual({
        url: "url1",
        valueCoding: {
          system: ICodeSystem.renderOptionsCodeSystem,
          code: "code1",
        },
      });
    });

    it("should return undefined if the extension with the given code is not found", () => {
      const result = findExtentionByCode(ICodeSystem.score, mockExtensions);
      expect(result).toBeUndefined();
    });

    it("should return undefined if the extensions array is undefined", () => {
      const result = findExtentionByCode(ICodeSystem.renderOptionsCodeSystem);
      expect(result).toBeUndefined();
    });
  });

  describe("getExtentionByCodeAndElement", () => {
    const getExtentionsFromElement = vi.fn();
    beforeEach(() => {
      getExtentionsFromElement.mockClear();
    });

    it("should find the correct extension by code from the given element", () => {
      const mockElement: Element = {
        extension: [
          {
            url: "url1",
            valueCoding: {
              system: ICodeSystem.choiceRenderOptions,
              code: "code1",
            },
          },
        ],
      };
      const mockExtensions: Extension[] = [
        {
          url: "url1",
          valueCoding: {
            system: ICodeSystem.choiceRenderOptions,
            code: "code1",
          },
        },
      ];

      getExtentionsFromElement.mockReturnValue(mockExtensions);

      const result = getExtensionByCodeAndElement(
        mockElement,
        ICodeSystem.choiceRenderOptions,
      );
      expect(result).toEqual({
        url: "url1",
        valueCoding: { system: ICodeSystem.choiceRenderOptions, code: "code1" },
      });
    });

    it("should return undefined if no extension with the given code is found in the element", () => {
      const mockElement: Element = {
        extension: [],
      };
      getExtentionsFromElement.mockReturnValue([]);

      const result = getExtensionByCodeAndElement(
        mockElement,
        ICodeSystem.progressIndicatorOptions,
      );
      expect(result).toBeUndefined();
    });
  });
  describe("hasOneOrMoreExtensions", () => {
    it("should return true if at least one extension matches an enum type", () => {
      const extensions: Extension[] = [
        { url: IExtensionType.authenticationRequirement },
        { url: "http://example.com/non-matching-type" },
      ];

      const extensionTypes: IExtensionType[] = [
        IExtensionType.authenticationRequirement,
      ];

      expect(hasOneOrMoreExtensions(extensions, extensionTypes)).toBe(true);
    });

    it("should return false if no extensions match any enum types", () => {
      const extensions: Extension[] = [
        { url: "http://example.com/non-matching-type-1" },
        { url: "http://example.com/non-matching-type-2" },
      ];

      const extensionTypes: IExtensionType[] = [
        IExtensionType.authenticationRequirement,
      ];

      expect(hasOneOrMoreExtensions(extensions, extensionTypes)).toBe(false);
    });
    it("should return false if the extensions array is empty", () => {
      const extensions: Extension[] = [];
      const extensionTypes: IExtensionType[] = [
        IExtensionType.authenticationRequirement,
      ];

      expect(hasOneOrMoreExtensions(extensions, extensionTypes)).toBe(false);
    });

    it("should return true if multiple types in extensionTypes match the extensions", () => {
      const extensions: Extension[] = [
        { url: IExtensionType.authenticationRequirement },
        { url: IExtensionType.calculatedExpression },
      ];
      const extensionTypes: IExtensionType[] = [
        IExtensionType.authenticationRequirement,
        IExtensionType.calculatedExpression,
        IExtensionType.canBePerformedBy, // This one does not match any extension
      ];

      expect(hasOneOrMoreExtensions(extensions, extensionTypes)).toBe(true);
    });
  });
});
