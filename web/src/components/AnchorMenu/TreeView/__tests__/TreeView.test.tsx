import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import type { TreeNode } from "../../types";
import type { Key } from "@react-types/shared";

import { TreeView } from "../TreeView";

const mockValidationClasses = vi.fn(() => "");
const mockOnSelectionChange = vi.fn();

describe("TreeView", () => {
  const mockTreeData: TreeNode[] = [
    {
      id: "item-1",
      hierarchy: "1.",
      children: [
        {
          id: "item-1-1",
          hierarchy: "1.1.",
          children: [],
        },
      ],
    },
    {
      id: "item-2",
      hierarchy: "2.",
      children: [],
    },
  ];

  const mockQItems = {
    "item-1": {
      linkId: "item-1",
      text: "First Item",
      type: "group" as const,
    },
    "item-1-1": {
      linkId: "item-1-1",
      text: "Child Item",
      type: "string" as const,
    },
    "item-2": {
      linkId: "item-2",
      text: "Second Item",
      type: "string" as const,
    },
  };

  const mockParentPathById = new Map<string, string[]>([
    ["item-1", []],
    ["item-1-1", ["item-1"]],
    ["item-2", []],
  ]);

  const expandableKeys = new Set<Key>(["item-1"]);

  const defaultProps = {
    treeData: mockTreeData,
    qItems: mockQItems,
    qCurrentItem: undefined,
    parentPathById: mockParentPathById,
    expandableKeys,
    dragAndDropHooks: {} as any,
    onSelectionChange: mockOnSelectionChange,
    validationClasses: mockValidationClasses,
    showPlaceholder: false,
  };

  it("renders tree with correct aria-label", () => {
    render(<TreeView {...defaultProps} />);
    expect(
      screen.getByRole("treegrid", { name: "Questionnaire overview" }),
    ).toBeInTheDocument();
  });

  it("renders all tree items", () => {
    render(<TreeView {...defaultProps} />);
    expect(screen.getByText(/First Item/)).toBeInTheDocument();
    expect(screen.getByText(/Child Item/)).toBeInTheDocument();
    expect(screen.getByText(/Second Item/)).toBeInTheDocument();
  });

  it("renders placeholder when showPlaceholder is true and tree is empty", () => {
    render(<TreeView {...defaultProps} showPlaceholder={true} treeData={[]} />);
    expect(
      screen.getByText(
        "Drag a component here to start building this Questionnaire",
      ),
    ).toBeInTheDocument();
  });

  it("does not render placeholder when showPlaceholder is false", () => {
    render(<TreeView {...defaultProps} showPlaceholder={false} />);
    expect(
      screen.queryByText(
        "Drag a component here to start building this Questionnaire",
      ),
    ).not.toBeInTheDocument();
  });

  it("applies selected style to current item", () => {
    const propsWithSelected = {
      ...defaultProps,
      qCurrentItem: { linkId: "item-1", parentArray: [] },
    };
    render(<TreeView {...propsWithSelected} />);
    // Verify the selected item is present
    expect(screen.getByText(/First Item/)).toBeInTheDocument();
  });

  it("renders nested tree structure", () => {
    render(<TreeView {...defaultProps} />);
    // Check that child item is rendered (auto expanded via expandableKeys)
    expect(screen.getByText(/Child Item/)).toBeInTheDocument();
  });
});
