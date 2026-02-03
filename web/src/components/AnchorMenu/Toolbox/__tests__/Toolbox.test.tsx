import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import type { TFunction } from "i18next";

import { Toolbox } from "../Toolbox";

const mockT = vi.fn((key: string) => key) as unknown as TFunction;

describe("Toolbox", () => {
  it("renders toolbox title", () => {
    render(<Toolbox t={mockT} recipientComponentLabel="Recipient component" />);
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("renders all toolbox items", () => {
    render(<Toolbox t={mockT} recipientComponentLabel="Recipient component" />);

    expect(screen.getByText("Group")).toBeInTheDocument();
    expect(screen.getByText("Text answer")).toBeInTheDocument();
    expect(screen.getByText("Information text")).toBeInTheDocument();
    expect(screen.getByText("Attachment")).toBeInTheDocument();
    expect(screen.getByText("Recipient list")).toBeInTheDocument();
    expect(screen.getByText("Recipient component")).toBeInTheDocument();
    expect(screen.getByText("Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Choice")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Number")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("renders drag handles for items", () => {
    render(<Toolbox t={mockT} recipientComponentLabel="Recipient component" />);
    const dragButtons = screen.getAllByRole("button", { name: "Drag" });
    expect(dragButtons.length).toBeGreaterThan(0);
  });

  it("uses custom recipient component label", () => {
    const customLabel = "Custom Recipient Label";
    render(<Toolbox t={mockT} recipientComponentLabel={customLabel} />);
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it("renders GridList with correct aria-label", () => {
    render(<Toolbox t={mockT} recipientComponentLabel="Recipient component" />);
    const gridList = screen.getByRole("grid", { name: "Components" });
    expect(gridList).toBeInTheDocument();
  });
});
