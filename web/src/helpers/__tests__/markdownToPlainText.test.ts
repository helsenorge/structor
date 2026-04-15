import { describe, it, expect } from "vitest";

import { markdownToPlainText } from "../markdownToPlainText";

describe("markdownToPlainText", () => {
  it("strips bold markdown", () => {
    expect(markdownToPlainText("**bold**")).toBe("bold");
  });

  it("strips italic markdown", () => {
    expect(markdownToPlainText("*italic*")).toBe("italic");
  });

  it("strips heading markdown", () => {
    expect(markdownToPlainText("# Heading")).toBe("Heading");
  });

  it("preserves link text and strips URL", () => {
    const result = markdownToPlainText("[link text](https://example.com)");
    expect(result).toContain("link text");
    expect(result).not.toContain("https://example.com");
  });

  it("strips list markers", () => {
    const result = markdownToPlainText("- item1\n- item2\n- item3");
    expect(result).toContain("item1");
    expect(result).toContain("item2");
    expect(result).not.toContain("-");
  });

  it("strips numbered list markers", () => {
    const result = markdownToPlainText("1. first\n2. second\n3. third");
    expect(result).toContain("first");
    expect(result).toContain("second");
    expect(result).not.toContain("1.");
  });

  it("handles mixed bold and italic", () => {
    const result = markdownToPlainText("**BOLD&#32;***ITALIC*");
    expect(result).not.toContain("**");
    expect(result).not.toContain("*");
    expect(result).toContain("BOLD");
    expect(result).toContain("ITALIC");
  });

  it("decodes HTML entities like &#32;", () => {
    const result = markdownToPlainText("hello&#32;world");
    expect(result).not.toContain("&#32;");
  });

  it("strips complex markdown with headings, bold, lists, and links", () => {
    const md =
      "# Title\n\n**bold** text with [link](https://vg.no)\n\n- item1\n- item2";
    const result = markdownToPlainText(md);
    expect(result).not.toContain("#");
    expect(result).not.toContain("**");
    expect(result).not.toContain("[");
    expect(result).not.toContain("https://");
    expect(result).toContain("Title");
    expect(result).toContain("bold");
    expect(result).toContain("link");
    expect(result).toContain("item1");
  });

  it("handles empty string", () => {
    expect(markdownToPlainText("")).toBe("");
  });

  it("handles plain text without markdown", () => {
    expect(markdownToPlainText("just plain text")).toBe("just plain text");
  });

  it("strips malformed/overlapping bold+italic markdown", () => {
    const input = "## asdad**asdasd*asdasd***\n\n### asdadasd";
    const result = markdownToPlainText(input);
    expect(result).not.toContain("*");
    expect(result).not.toContain("#");
    expect(result).toContain("asdad");
    expect(result).toContain("asdasd");
    expect(result).toContain("asdadasd");
  });

  it("strips stray underscores from malformed markdown", () => {
    const result = markdownToPlainText("__bold_text___");
    expect(result).not.toContain("_");
    expect(result).toContain("bold");
  });

  it("strips leftover strikethrough", () => {
    const result = markdownToPlainText("~~deleted~~");
    expect(result).not.toContain("~~");
    expect(result).toContain("deleted");
  });
});
