import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Toolbox } from "../Toolbox";

describe("Toolbox", () => {
  it("renders toolbox title", () => {
    render(<Toolbox recipientComponentLabel="Recipient component" />);
    expect(
      screen.getByRole("grid", { name: "Components" }),
    ).toBeInTheDocument();
  });

  it("renders all toolbox items", () => {
    render(<Toolbox recipientComponentLabel="Recipient component" />);

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
    render(<Toolbox recipientComponentLabel="Recipient component" />);
    // react-aria renders slot="drag" buttons only with full drag context;
    // verify items are draggable via the HTML draggable attribute instead
    const rows = screen.getAllByRole("row");
    const draggableRows = rows.filter(
      (row) => row.getAttribute("draggable") === "true",
    );
    expect(draggableRows.length).toBeGreaterThan(0);
  });

  it("uses custom recipient component label", () => {
    const customLabel = "Custom Recipient Label";
    render(<Toolbox recipientComponentLabel={customLabel} />);
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it("renders GridList with correct aria-label", () => {
    render(<Toolbox recipientComponentLabel="Recipient component" />);
    const gridList = screen.getByRole("grid", { name: "Components" });
    expect(gridList).toBeInTheDocument();
  });
});
