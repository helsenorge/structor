import React, { ReactNode } from "react";

import {
  Queries,
  render,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeSystem, ValueSet } from "fhir/r4";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import i18n from "src/helpers/i18n";
import { getInitialState } from "src/store/treeStore/initialState";
import {
  ActionType,
  TreeContext,
  TreeState,
} from "src/store/treeStore/treeStore";
import { CodeSystemProvider } from "src/views/codeSystems/context/CodeSystemContextProvider";
import { ValueSetProvider } from "src/views/valueSets/context/ValueSetContextProvider";
import { Mock, vi } from "vitest";

interface ProvidersProps {
  children: ReactNode;
  /**
   * You can override dispatch if you want to assert calls,
   * @default vi.fn()
   */
  dispatch?: React.Dispatch<ActionType> | Mock;
  /**
   * Initial entries for MemoryRouter (e.g. ['/login', '/dashboard']).
   */
  initialEntries?: MemoryRouterProps["initialEntries"];
  /**
   * Initial state for the TreeContext.
   * @default getInitialState()
   */
  state?: Partial<TreeState>;
  initialValueSet?: ValueSet;
  initialCodeSystem?: CodeSystem;
}

const Providers = ({
  children,
  dispatch = vi.fn(),
  initialEntries = ["/"],
  state = getInitialState(),
  initialValueSet,
  initialCodeSystem,
}: ProvidersProps): React.JSX.Element => {
  const newState = state as TreeState;
  return (
    <I18nextProvider i18n={i18n}>
      <TreeContext.Provider value={{ dispatch, state: newState }}>
        <MemoryRouter initialEntries={initialEntries}>
          {initialValueSet ? (
            <ValueSetProvider initialValueSet={initialValueSet}>
              {children}
            </ValueSetProvider>
          ) : initialCodeSystem ? (
            <CodeSystemProvider initCodeSystem={initialCodeSystem}>
              {children}
            </CodeSystemProvider>
          ) : (
            children
          )}
        </MemoryRouter>
      </TreeContext.Provider>
    </I18nextProvider>
  );
};

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  dispatch?: React.Dispatch<ActionType> | Mock;
  initialEntries?: MemoryRouterProps["initialEntries"];
  initialValueSet?: ValueSet;
};

export function renderWithProviders(
  ui: ReactNode,
  {
    dispatch,
    initialEntries,
    initialValueSet,
    ...renderOptions
  }: CustomRenderOptions = {},
): RenderResult<Queries, HTMLElement, HTMLElement> {
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers
        dispatch={dispatch}
        initialEntries={initialEntries}
        initialValueSet={initialValueSet}
      >
        {children}
      </Providers>
    ),
    ...renderOptions,
  }) as unknown as RenderResult<Queries, HTMLElement, HTMLElement>;
}

export * from "@testing-library/react";
const user = userEvent.setup({
  delay: null,
});
export { renderWithProviders as render, user as userEvent };
