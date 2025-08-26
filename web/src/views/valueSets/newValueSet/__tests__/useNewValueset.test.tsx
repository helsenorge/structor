import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ValueSet } from "fhir/r4";
import { ActionType, TreeContext } from "src/store/treeStore/treeStore";

const ctx = vi.hoisted(() => ({
  valueSetCtx: {
    newValueSet: {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:mock",
    } as ValueSet,
    reset: vi.fn(),
  },
}));

vi.mock("../context/useValueSetContext", () => ({
  useValueSetContext: () => ctx.valueSetCtx,
}));

vi.mock("src/store/treeStore/treeActions", async (importOriginal) => {
  const actual = await importOriginal<ActionType>();
  return {
    ...actual,
    updateFhirResourceAction: vi.fn((item: any) => ({
      type: "MOCK_UPDATE",
      item,
    })),
    removeFhirResourceAction: vi.fn((item: any) => ({
      type: "MOCK_REMOVE",
      item,
    })),
  };
});

import useNewValueSet from "../useNewValueset";
import * as treeActions from "src/store/treeStore/treeActions";
import { ValueSetContext } from "../../context/ValuseSetContext";

const actions = vi.mocked(treeActions, true);

afterEach(() => {
  vi.clearAllMocks();
  ctx.valueSetCtx.newValueSet = {
    resourceType: "ValueSet",
    status: "draft",
    url: "urn:mock",
  } as ValueSet;
  ctx.valueSetCtx.reset = vi.fn();
});

function makeWrapper({
  dispatch = vi.fn(),
  qContained = [] as Array<{ id?: string }>,
}: {
  dispatch?: ReturnType<typeof vi.fn>;
  qContained?: Array<{ id?: string }>;
}) {
  return ({ children }: { children: React.ReactNode }) => (
    <TreeContext.Provider value={{ dispatch, state: { qContained } } as any}>
      <ValueSetContext.Provider
        value={{
          canEdit: vi.fn(),
          copyComposeIncludeConcept: vi.fn(),
          handleEdit: vi.fn(),
          newValueSet: ctx.valueSetCtx.newValueSet,
          reset: ctx.valueSetCtx.reset,
          setNewValueSet: vi.fn(),
          valueSets: [],
        }}
      >
        {children}
      </ValueSetContext.Provider>
    </TreeContext.Provider>
  );
}

describe("useNewValueSet", () => {
  it("startNewValueSet calls reset and scrollToTarget", () => {
    const wrapper = makeWrapper({ dispatch: vi.fn(), qContained: [] });
    const scrollToTarget = vi.fn();

    const { result } = renderHook(() => useNewValueSet({ scrollToTarget }), {
      wrapper,
    });

    act(() => {
      result.current.startNewValueSet();
    });

    expect(ctx.valueSetCtx.reset).toHaveBeenCalledTimes(1);
    expect(scrollToTarget).toHaveBeenCalledTimes(1);
  });

  it("dispatchValueSet dispatches update action and scrolls", () => {
    const dispatch = vi.fn();
    const wrapper = makeWrapper({ dispatch, qContained: [] });
    const scrollToTarget = vi.fn();

    const vs: ValueSet = {
      resourceType: "ValueSet",
      id: "vs-1",
      status: "draft",
      url: "urn:vs1",
    };
    ctx.valueSetCtx.newValueSet = vs;

    const { result } = renderHook(() => useNewValueSet({ scrollToTarget }), {
      wrapper,
    });

    act(() => {
      result.current.dispatchValueSet();
    });

    expect(actions.updateFhirResourceAction).toHaveBeenCalledWith(vs);
    expect(dispatch).toHaveBeenCalledWith({ type: "MOCK_UPDATE", item: vs });
    expect(scrollToTarget).toHaveBeenCalledTimes(1);
  });

  it("dispatchDeleteValueSet does nothing when id is missing", () => {
    const wrapper = makeWrapper({ dispatch: vi.fn(), qContained: [] });
    const scrollToTarget = vi.fn();

    ctx.valueSetCtx.newValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:no-id",
    } as ValueSet;

    const { result } = renderHook(() => useNewValueSet({ scrollToTarget }), {
      wrapper,
    });

    act(() => {
      result.current.dispatchDeleteValueSet();
    });

    expect(actions.removeFhirResourceAction).not.toHaveBeenCalled();
    expect(scrollToTarget).not.toHaveBeenCalled();
    expect(ctx.valueSetCtx.reset).not.toHaveBeenCalled();
  });

  it("dispatchDeleteValueSet dispatches remove, resets and scrolls when id exists", () => {
    const dispatch = vi.fn();
    const wrapper = makeWrapper({ dispatch, qContained: [] });
    const scrollToTarget = vi.fn();

    const vs: ValueSet = {
      resourceType: "ValueSet",
      id: "vs-del",
      status: "draft",
      url: "urn:del",
    };
    ctx.valueSetCtx.newValueSet = vs;

    const { result } = renderHook(() => useNewValueSet({ scrollToTarget }), {
      wrapper,
    });

    act(() => {
      result.current.dispatchDeleteValueSet();
    });

    expect(actions.removeFhirResourceAction).toHaveBeenCalledWith(vs);
    expect(dispatch).toHaveBeenCalledWith({ type: "MOCK_REMOVE", item: vs });
    expect(ctx.valueSetCtx.reset).toHaveBeenCalledTimes(1);
    expect(scrollToTarget).toHaveBeenCalledTimes(1);
  });

  it("isNewValueSet is true when there is no id", () => {
    const wrapper = makeWrapper({
      dispatch: vi.fn(),
      qContained: [{ id: "a" }, { id: "b" }],
    });

    ctx.valueSetCtx.newValueSet = {
      resourceType: "ValueSet",
      status: "draft",
      url: "urn:noid",
    } as ValueSet;

    const { result } = renderHook(
      () => useNewValueSet({ scrollToTarget: vi.fn() }),
      { wrapper },
    );

    expect(result.current.isNewValueSet).toBe(true);
  });

  it("isNewValueSet is true when id not found in qContained", () => {
    const wrapper = makeWrapper({
      dispatch: vi.fn(),
      qContained: [{ id: "a" }, { id: "b" }],
    });

    ctx.valueSetCtx.newValueSet = {
      resourceType: "ValueSet",
      id: "x",
      status: "draft",
      url: "urn:x",
    } as ValueSet;

    const { result } = renderHook(
      () => useNewValueSet({ scrollToTarget: vi.fn() }),
      { wrapper },
    );

    expect(result.current.isNewValueSet).toBe(true);
  });

  it("isNewValueSet is false when id is present in qContained", () => {
    const wrapper = makeWrapper({
      dispatch: vi.fn(),
      qContained: [{ id: "a" }, { id: "b" }],
    });

    ctx.valueSetCtx.newValueSet = {
      resourceType: "ValueSet",
      id: "b",
      status: "draft",
      url: "urn:b",
    } as ValueSet;

    const { result } = renderHook(
      () => useNewValueSet({ scrollToTarget: vi.fn() }),
      { wrapper },
    );

    expect(result.current.isNewValueSet).toBe(false);
  });

  it("exposes the same newValueSet instance from context", () => {
    const wrapper = makeWrapper({ dispatch: vi.fn(), qContained: [] });
    const vs: ValueSet = {
      resourceType: "ValueSet",
      id: "z",
      status: "draft",
      url: "urn:z",
    };
    ctx.valueSetCtx.newValueSet = vs;

    const { result } = renderHook(
      () => useNewValueSet({ scrollToTarget: vi.fn() }),
      { wrapper },
    );

    expect(result.current.newValueSet).toBe(vs);
  });
});
