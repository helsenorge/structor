import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { DragHandle } from "../DragHandle";

describe("DragHandle", () => {
  it("renders with correct aria-label", () => {
    render(<DragHandle ariaLabel="Drag item" />);
    expect(
      screen.getByRole("button", { name: "Drag item" }),
    ).toBeInTheDocument();
  });

  it("renders with tree variant by default", () => {
    render(<DragHandle ariaLabel="Drag" />);
    const button = screen.getByRole("button", { name: "Drag" });
    expect(button).toHaveClass("tree");
  });

  it("renders with toolbox variant when specified", () => {
    render(<DragHandle ariaLabel="Drag" variant="toolbox" />);
    const button = screen.getByRole("button", { name: "Drag" });
    expect(button).toHaveClass("toolbox");
  });

  it("renders dots decoration", () => {
    const { container } = render(<DragHandle ariaLabel="Drag" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const dots = container.querySelector('[aria-hidden="true"]');
    expect(dots).toBeInTheDocument();
  });
});
