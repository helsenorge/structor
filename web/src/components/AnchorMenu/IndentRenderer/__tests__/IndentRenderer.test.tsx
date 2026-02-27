import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { IndentRenderer } from "../IndentRenderer";

describe("IndentRenderer", () => {
  it("renders with no ancestor continuations", () => {
    const { container } = render(
      <IndentRenderer
        nodeId="test-1"
        ancestorContinuations={[]}
        isLast={false}
      />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indent = container.querySelector('[aria-hidden="true"]');
    expect(indent).toBeInTheDocument();
  });

  it("renders correct number of indent columns", () => {
    // ancestorContinuations=[true, false, true] → slice(0,-1) gives [true, false]
    // plus 1 self column = 3 total spans, but only 2 with data-continuation
    const { container } = render(
      <IndentRenderer
        nodeId="test-2"
        ancestorContinuations={[true, false, true]}
        isLast={false}
      />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indentCols = container.querySelectorAll("[data-continuation]");
    expect(indentCols).toHaveLength(2);
  });

  it("sets data-continuation attribute correctly", () => {
    // ancestorContinuations=[true, false, true] → slice(0,-1) gives [true, false]
    const { container } = render(
      <IndentRenderer
        nodeId="test-3"
        ancestorContinuations={[true, false, true]}
        isLast={false}
      />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const indentCols = container.querySelectorAll("[data-continuation]");
    expect(indentCols[0]).toHaveAttribute("data-continuation", "1");
    expect(indentCols[1]).toHaveAttribute("data-continuation", "0");
  });

  it("sets data-last attribute on self column", () => {
    const { container } = render(
      <IndentRenderer
        nodeId="test-4"
        ancestorContinuations={[]}
        isLast={true}
      />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const selfCol = container.querySelector("[data-last]");
    expect(selfCol).toHaveAttribute("data-last", "1");
  });

  it("sets data-last=0 when not last", () => {
    const { container } = render(
      <IndentRenderer
        nodeId="test-5"
        ancestorContinuations={[]}
        isLast={false}
      />,
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const selfCol = container.querySelector("[data-last]");
    expect(selfCol).toHaveAttribute("data-last", "0");
  });
});
