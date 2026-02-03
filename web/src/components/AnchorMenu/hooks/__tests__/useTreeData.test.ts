import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { OrderItem, Items } from "../../../../store/treeStore/treeStore";

import { useTreeData, useExpandedKeys } from "../useTreeData";

describe("useTreeData", () => {
  const mockQItems: Items = {
    "item-1": {
      linkId: "item-1",
      text: "First Item",
      type: "group",
    },
    "item-1-1": {
      linkId: "item-1-1",
      text: "Child Item",
      type: "string",
    },
    "item-2": {
      linkId: "item-2",
      text: "Second Item",
      type: "string",
    },
  };

  const mockQOrder: OrderItem[] = [
    {
      linkId: "item-1",
      items: [
        {
          linkId: "item-1-1",
          items: [],
        },
      ],
    },
    {
      linkId: "item-2",
      items: [],
    },
  ];

  it("returns tree data structure", () => {
    const { result } = renderHook(() => useTreeData(mockQOrder, mockQItems));

    expect(result.current.treeData).toHaveLength(2);
    expect(result.current.treeData[0].id).toBe("item-1");
    expect(result.current.treeData[0].hierarchy).toBe("1.");
    // eslint-disable-next-line testing-library/no-node-access
    expect(result.current.treeData[0].children).toHaveLength(1);
    // eslint-disable-next-line testing-library/no-node-access
    expect(result.current.treeData[0].children[0].id).toBe("item-1-1");
  });

  it("returns parent path map", () => {
    const { result } = renderHook(() => useTreeData(mockQOrder, mockQItems));

    expect(result.current.parentPathById.get("item-1")).toEqual([]);
    expect(result.current.parentPathById.get("item-1-1")).toEqual(["item-1"]);
    expect(result.current.parentPathById.get("item-2")).toEqual([]);
  });

  it("returns expandable keys for items with children", () => {
    const { result } = renderHook(() => useTreeData(mockQOrder, mockQItems));

    expect(result.current.expandableKeys.has("item-1")).toBe(true);
    expect(result.current.expandableKeys.has("item-2")).toBe(false);
  });

  it("handles empty order", () => {
    const { result } = renderHook(() => useTreeData([], mockQItems));

    expect(result.current.treeData).toHaveLength(0);
    expect(result.current.parentPathById.size).toBe(0);
    expect(result.current.expandableKeys.size).toBe(0);
  });
});

describe("useExpandedKeys", () => {
  it("initializes with empty set", () => {
    const { result } = renderHook(() => useExpandedKeys(new Set()));

    expect(result.current[0].size).toBe(0);
  });

  it("auto-expands when expandable keys are provided", () => {
    const expandableKeys = new Set(["item-1", "item-2"]);
    const { result } = renderHook(() => useExpandedKeys(expandableKeys));

    expect(result.current[0].size).toBe(2);
    expect(result.current[0].has("item-1")).toBe(true);
    expect(result.current[0].has("item-2")).toBe(true);
  });

  it("does not override manually set expanded keys", () => {
    const expandableKeys = new Set(["item-1", "item-2"]);
    const { result, rerender } = renderHook(() =>
      useExpandedKeys(expandableKeys),
    );

    // Manually set some keys
    result.current[1](new Set(["item-1"]));

    // Re-render shouldn't reset
    rerender();

    expect(result.current[0].size).toBe(1);
    expect(result.current[0].has("item-1")).toBe(true);
  });
});
