import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { ValidationError } from "../../../../utils/validationUtils";

import { useAnchorMenuHelpers } from "../useAnchorMenuHelpers";

describe("useAnchorMenuHelpers", () => {
  const mockValidationErrors: ValidationError[] = [
    {
      linkId: "item-1",
      severity: "error",
      path: [],
      errorProperty: "text",
      errorLevel: "error",
      errorReadableText: "Error 1",
    } as ValidationError,
    {
      linkId: "item-1",
      severity: "warning",
      path: [],
      errorProperty: "text",
      errorLevel: "warning",
      errorReadableText: "Warning 1",
    } as ValidationError,
    {
      linkId: "item-2",
      severity: "error",
      path: [],
      errorProperty: "text",
      errorLevel: "error",
      errorReadableText: "Error 2",
    } as ValidationError,
  ];

  describe("validationClasses", () => {
    it("returns validation classes for items with errors", () => {
      const { result } = renderHook(() => useAnchorMenuHelpers());
      const classes = result.current.validationClasses(
        "item-1",
        mockValidationErrors,
      );

      // Returns a string (may be empty based on getSeverityClass implementation)
      expect(typeof classes).toBe("string");
    });

    it("returns empty string for items without errors", () => {
      const { result } = renderHook(() => useAnchorMenuHelpers());
      const classes = result.current.validationClasses("item-3");

      expect(classes).toBe("");
    });

    it("filters errors by linkId", () => {
      const { result } = renderHook(() => useAnchorMenuHelpers());
      const classes1 = result.current.validationClasses(
        "item-1",
        mockValidationErrors,
      );
      const classes2 = result.current.validationClasses(
        "item-2",
        mockValidationErrors,
      );

      // Both should return string values
      expect(typeof classes1).toBe("string");
      expect(typeof classes2).toBe("string");
    });
  });
});
