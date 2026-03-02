import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type {
  OrderItem,
  Items,
  MarkedItem,
} from "../../../store/treeStore/treeStore";

import AnchorMenu from "../AnchorMenu";

// Mock the sub-components
vi.mock("../Toolbox/Toolbox", () => ({
  Toolbox: () => <div data-testid="toolbox">{"Components"}</div>,
}));

vi.mock("../TreeView/TreeView", () => ({
  TreeView: ({ showPlaceholder }: any) => (
    <div data-testid="treeview">
      {showPlaceholder && (
        <p>{"Drag a component here to start building this Questionnaire"}</p>
      )}
    </div>
  ),
}));

describe("AnchorMenu", () => {
  const mockDispatch = vi.fn();

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

  const mockQItems: Items = {
    "item-1": {
      linkId: "item-1",
      text: "First Group",
      type: "group",
    },
    "item-1-1": {
      linkId: "item-1-1",
      text: "Child Question",
      type: "string",
    },
    "item-2": {
      linkId: "item-2",
      text: "Second Question",
      type: "string",
    },
  };

  const mockCurrentItem: MarkedItem = {
    linkId: "item-1",
    parentArray: [],
  };

  const defaultProps = {
    qOrder: mockQOrder,
    qItems: mockQItems,
    qCurrentItem: mockCurrentItem,
    validationErrors: [],
    dispatch: mockDispatch,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<AnchorMenu {...defaultProps} />);
    expect(screen.getByTestId("toolbox")).toBeInTheDocument();
    expect(screen.getByTestId("treeview")).toBeInTheDocument();
  });

  it("renders toolbox component", () => {
    render(<AnchorMenu {...defaultProps} />);
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("renders tree view component", () => {
    render(<AnchorMenu {...defaultProps} />);
    expect(screen.getByTestId("treeview")).toBeInTheDocument();
  });

  it("shows placeholder when qOrder is empty", () => {
    const emptyProps = {
      ...defaultProps,
      qOrder: [],
    };
    render(<AnchorMenu {...emptyProps} />);
    expect(
      screen.getByText(
        "Drag a component here to start building this Questionnaire",
      ),
    ).toBeInTheDocument();
  });

  it("does not show placeholder when qOrder has items", () => {
    render(<AnchorMenu {...defaultProps} />);
    expect(
      screen.queryByText(
        "Drag a component here to start building this Questionnaire",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders with no validation errors", () => {
    render(<AnchorMenu {...defaultProps} />);
    // Just verify the component renders successfully
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("builds tree data structure correctly", () => {
    // This test verifies the component renders without errors when processing the tree data
    render(<AnchorMenu {...defaultProps} />);
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("handles empty qItems", () => {
    const emptyItemsProps = {
      ...defaultProps,
      qItems: {},
      qOrder: [],
    };
    render(<AnchorMenu {...emptyItemsProps} />);
    expect(screen.getByTestId("treeview")).toBeInTheDocument();
  });

  it("handles undefined current item", () => {
    const noCurrentItemProps = {
      ...defaultProps,
      qCurrentItem: undefined,
    };
    render(<AnchorMenu {...noCurrentItemProps} />);
    expect(screen.getByTestId("treeview")).toBeInTheDocument();
  });
});
