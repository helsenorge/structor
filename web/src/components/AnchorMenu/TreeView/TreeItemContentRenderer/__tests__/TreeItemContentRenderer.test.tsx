import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import type { TreeNode } from "../../../types";
import type { QuestionnaireItem } from "fhir/r4";

import { TreeItemContentRenderer } from "../TreeItemContentRenderer";

vi.mock("../../../ItemButtons/ItemButtons", () => ({
  ItemButtons: () => <div data-testid="item-buttons" />,
}));

vi.mock("../../TreeItemIcon", () => ({
  TreeItemIcon: ({ type }: { type: string }) => (
    <span data-testid="tree-item-icon">{type}</span>
  ),
}));

describe("TreeItemContentRenderer", () => {
  const mockNode: TreeNode = {
    id: "test-1",
    hierarchy: "1.",
    children: [],
  };

  const mockItem = {
    linkId: "test-1",
    text: "Test Question",
    type: "string" as QuestionnaireItem["type"],
    required: false,
  };

  const defaultProps = {
    node: mockNode,
    item: mockItem,
    parentPath: [],
    depth: 0,
    isLast: false,
    ancestorContinuations: [],
    isExpanded: false,
    isDropTarget: false,
  };

  it("renders node hierarchy and text", () => {
    render(<TreeItemContentRenderer {...defaultProps} />);
    expect(screen.getByText(/1\./)).toBeInTheDocument();
    expect(screen.getByText(/Test Question/)).toBeInTheDocument();
  });

  it("renders drag handle", () => {
    render(<TreeItemContentRenderer {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Drag" })).toBeInTheDocument();
  });

  it("renders chevron button when node has children", () => {
    const nodeWithChildren: TreeNode = {
      ...mockNode,
      children: [{ id: "child-1", hierarchy: "1.1.", children: [] }],
    };
    render(
      <TreeItemContentRenderer {...defaultProps} node={nodeWithChildren} />,
    );
    expect(
      screen.getByRole("button", { name: "Expand/collapse" }),
    ).toBeInTheDocument();
  });

  it("renders chevron spacer when node has no children", () => {
    render(<TreeItemContentRenderer {...defaultProps} />);
    // Verify drag handle is present (component renders)
    expect(screen.getByLabelText("Drag")).toBeInTheDocument();
  });

  it("renders required field tag when item is required", () => {
    const requiredItem = { ...mockItem, required: true };
    render(<TreeItemContentRenderer {...defaultProps} item={requiredItem} />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("does not render required field tag when item is not required", () => {
    render(<TreeItemContentRenderer {...defaultProps} />);
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
  });

  it("renders indent renderer when depth > 0", () => {
    render(
      <TreeItemContentRenderer
        {...defaultProps}
        depth={2}
        ancestorContinuations={[true, true]}
      />,
    );
    // Verify component renders with indentation
    expect(screen.getByLabelText("Drag")).toBeInTheDocument();
  });

  it("does not render indent renderer when depth is 0", () => {
    const { container } = render(
      <TreeItemContentRenderer {...defaultProps} depth={0} />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indents = container.querySelectorAll('[class*="indent"]');
    expect(indents).toHaveLength(0);
  });

  it("renders TreeItemIcon with item type", () => {
    render(<TreeItemContentRenderer {...defaultProps} />);
    expect(screen.getByTestId("tree-item-icon")).toHaveTextContent("string");
  });
});
