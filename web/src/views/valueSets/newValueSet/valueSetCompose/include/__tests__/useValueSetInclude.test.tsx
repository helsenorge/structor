import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ValueSet, ValueSetComposeInclude } from "fhir/r4";

import useValueSetInclude from "../useValueSetInclude";
import { ValueSetContext } from "src/views/valueSets/context/ValuseSetContext";

vi.mock("src/helpers/CreateUUID", () => {
  let n = 0;
  return { default: vi.fn(() => `uuid-${++n}`) };
});

vi.mock("src/views/valueSets/utils/intialValuesets", () => {
  return {
    initialComposeInclude: vi.fn(
      (): ValueSetComposeInclude => ({
        system: "http://example.org/system",
        version: "1",
        concept: [],
      }),
    ),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

function makeVSWrapper(initial: ValueSet) {
  return ({ children }: { children: React.ReactNode }) => {
    const [vs, setVs] = React.useState<ValueSet>(initial);
    return (
      <ValueSetContext.Provider
        value={
          {
            newValueSet: vs,
            setNewValueSet: (next: any) =>
              setVs((prev) => (typeof next === "function" ? next(prev) : next)),
            reset: vi.fn(),
            canEdit: vi.fn(() => true),
            handleEdit: vi.fn(),
            copyComposeIncludeConcept: vi.fn(),
            valueSets: [],
          } as any
        }
      >
        {children}
      </ValueSetContext.Provider>
    );
  };
}

describe("useValueSetInclude", () => {
  it("addNewInclude appends an include from initialComposeInclude()", async () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: { include: [] },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    expect(result.current.include).toEqual([]);

    act(() => {
      result.current.addNewInclude();
    });

    expect(result.current.include).toHaveLength(1);
    expect(result.current.include?.[0]).toEqual({
      system: "http://example.org/system",
      version: "1",
      concept: [],
    });

    act(() => {
      result.current.addNewInclude();
    });
    expect(result.current.include).toHaveLength(2);
  });

  it("removeInclude removes the include at index", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: {
        include: [
          { system: "s1", version: "v1" },
          { system: "s2", version: "v2" },
          { system: "s3", version: "v3" },
        ],
      },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    act(() => {
      result.current.removeInclude(1);
    });

    expect(result.current.include).toEqual([
      { system: "s1", version: "v1" },
      { system: "s3", version: "v3" },
    ]);
  });

  it("handleUpdateValue updates system", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: { include: [{ system: "old", version: "1" }] },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    act(() => {
      result.current.handleUpdateValue("new-system", 0, "system");
    });

    expect(result.current.include?.[0].system).toBe("new-system");
    expect(result.current.include?.[0].version).toBe("1"); // unchanged
  });

  it("handleUpdateValue updates version", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: { include: [{ system: "s", version: "old" }] },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    act(() => {
      result.current.handleUpdateValue("2", 0, "version");
    });

    expect(result.current.include?.[0].version).toBe("2");
    expect(result.current.include?.[0].system).toBe("s"); // unchanged
  });

  it("addNewElement initializes concept[] when missing (default index 0) and generates UUID", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: { include: [{ system: "s1", version: "v1" }] }, // no concept yet
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    act(() => {
      result.current.addNewElement(); // default includeIndex=0
    });

    expect(result.current.include?.[0].concept).toEqual([
      { id: "uuid-1", code: "", display: "" },
    ]);
  });

  it("addNewElement pushes to existing concept[] and increments UUID", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: {
        include: [
          {
            system: "s1",
            version: "v1",
            concept: [{ id: "pre", code: "A", display: "A" }],
          },
        ],
      },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    act(() => {
      result.current.addNewElement(0);
    });

    expect(result.current.include?.[0].concept).toEqual([
      { id: "pre", code: "A", display: "A" },
      { id: "uuid-2", code: "", display: "" },
    ]);

    act(() => {
      result.current.addNewElement(0);
    });

    expect(result.current.include?.[0].concept).toEqual([
      { id: "pre", code: "A", display: "A" },
      { id: "uuid-2", code: "", display: "" },
      { id: "uuid-3", code: "", display: "" },
    ]);
  });

  it("exposes include from current ValueSet and reflects updates", () => {
    const initial: ValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:test",
      compose: { include: [] },
    };

    const wrapper = makeVSWrapper(initial);
    const { result } = renderHook(() => useValueSetInclude(), { wrapper });

    expect(result.current.include).toEqual([]);

    act(() => {
      result.current.addNewInclude();
    });

    expect(result.current.include?.length).toBe(1);
    expect(result.current.include?.[0]).toMatchObject({
      system: "http://example.org/system",
      version: "1",
    });
  });
});
