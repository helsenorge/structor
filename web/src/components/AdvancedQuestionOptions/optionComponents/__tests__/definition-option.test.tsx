import { QuestionnaireItem } from "fhir/r4";
import { updateItemAction } from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import { DefinitionOption } from "../definition-option";
import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IItemProperty } from "src/types/IQuestionnareItemType";

vi.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (i18nKey: any) => i18nKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));
vi.mock("src/store/treeStore/treeActions");
const updateItemActionMock = updateItemAction as Mock;

describe("DefinitionOption", () => {
  beforeEach(() => {
    updateItemActionMock.mockClear();
  });

  it("Item does not have any definition", () => {
    const item = { linkId: "1" } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <DefinitionOption item={item} />
      </TreeContext.Provider>,
    );

    expect(screen.getByText("Definition")).toBeInTheDocument();
    expect(screen.getByTestId("definition-testid").getAttribute("value")).toBe(
      "",
    );
  });

  it("Item has definition", () => {
    const item = {
      linkId: "1",
      definition:
        "http://hl7.org/fhir/StructureDefinition/observation#value[x]",
    } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <DefinitionOption item={item} />
      </TreeContext.Provider>,
    );

    expect(screen.getByTestId("definition-testid").getAttribute("value")).toBe(
      "http://hl7.org/fhir/StructureDefinition/observation#value[x]",
    );
  });

  it("User writes a definition", async () => {
    const item = { linkId: "1" } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <DefinitionOption item={item} />
      </TreeContext.Provider>,
    );
    const uri = screen.getByTestId("definition-testid");

    await userEvent.type(uri, "Testing");
    await userEvent.tab(); // blur

    expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(
      IItemProperty.definition,
    );
    expect(updateItemActionMock.mock.calls[0][2]).toEqual("Testing");
  });

  it("User removes the definition", async () => {
    const item = {
      linkId: "1",
      definition:
        "http://hl7.org/fhir/StructureDefinition/observation#value[x]",
    } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <DefinitionOption item={item} />
      </TreeContext.Provider>,
    );
    const uri = screen.getByTestId("definition-testid");

    await userEvent.clear(uri);
    await userEvent.tab(); // blur

    expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(
      IItemProperty.definition,
    );
    expect(updateItemActionMock.mock.calls[0][2]).toEqual("");
  });
});
