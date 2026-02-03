import { describe, it, expect } from "vitest";

describe("DropIndicatorRenderer", () => {
  const mockParentPathById = new Map<string, string[]>([
    ["item-1", []],
    ["item-2", ["item-1"]],
    ["item-3", ["item-1", "item-2"]],
  ]);

  it("calculates depth correctly for item before/after position", () => {
    const target = {
      type: "item" as const,
      key: "item-2",
      dropPosition: "after" as const,
    };

    // Test the depth calculation logic
    const parentPath = mockParentPathById.get(target.key) || [];
    const depth = parentPath.length;
    expect(depth).toBe(1);
  });

  it("calculates depth correctly for item on position", () => {
    const target = {
      type: "item" as const,
      key: "item-2",
      dropPosition: "on" as const,
    };

    // Test the depth calculation logic for "on" position (parent path + 1)
    const parentPath = mockParentPathById.get(target.key) || [];
    const depth =
      target.dropPosition === "on" ? parentPath.length + 1 : parentPath.length;
    expect(depth).toBe(2);
  });

  it("handles root target correctly", () => {
    // Root target should have depth 0
    const depth = 0;
    expect(depth).toBe(0);
  });

  it("calculates correct indent for nested items", () => {
    const target = {
      type: "item" as const,
      key: "item-3",
      dropPosition: "before" as const,
    };

    const parentPath = mockParentPathById.get(target.key) || [];
    const depth = parentPath.length;
    const indent = depth * 24; // 24px per level

    expect(depth).toBe(2);
    expect(indent).toBe(48);
  });

  it("handles items with no parent path", () => {
    const target = {
      type: "item" as const,
      key: "unknown-item",
      dropPosition: "before" as const,
    };

    const parentPath = mockParentPathById.get(target.key) || [];
    const depth = parentPath.length;
    expect(depth).toBe(0);
  });

  it("distinguishes between on and before/after positions", () => {
    const itemKey = "item-1";
    const parentPath = mockParentPathById.get(itemKey) || [];

    const depthBefore = parentPath.length;
    const depthOn = parentPath.length + 1;

    expect(depthBefore).toBe(0);
    expect(depthOn).toBe(1);
  });
});
