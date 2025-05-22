import {
  Items,
  OrderItem,
  TreeContext,
  TreeState,
} from "src/store/treeStore/treeStore";
import { QuestionnaireItem } from "fhir/r4";
import { render, screen } from "@testing-library/react";
import {
  addItemCodeAction,
  deleteItemCodeAction,
  updateItemCodePropertyAction,
} from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import Codes from "../Codes";
import userEvent from "@testing-library/user-event";
import { ICodeSystem, ICodingProperty } from "src/types/IQuestionnareItemType";

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

describe("Codes", () => {
  let item = {} as QuestionnaireItem;
  vi.mock("src/store/treeStore/treeActions");

  const deleteItemCodeActionMock = deleteItemCodeAction as Mock;
  const addItemCodeActionMock = addItemCodeAction as Mock;
  const updateItemCodePropertyActionMock = updateItemCodePropertyAction as Mock;

  beforeEach(() => {
    item = {
      linkId: "1",
      type: "string",
      text: "Text",
    } as QuestionnaireItem;
    deleteItemCodeActionMock.mockClear();
    addItemCodeActionMock.mockClear();
    updateItemCodePropertyActionMock.mockClear();
  });

  it("item does not have any code", () => {
    const treeState = {
      qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
      qItems: { "1": item } as Items,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <Codes linkId="1" itemValidationErrors={[]} />
      </TreeContext.Provider>,
    );

    const addCode = screen.getByTestId("code-add");
    expect(addCode).toBeInTheDocument();

    const removeCode = screen.queryByTestId("code-remove-0");
    expect(removeCode).not.toBeInTheDocument();

    const displayElement = screen.queryByTestId("code-display-0");
    expect(displayElement).not.toBeInTheDocument();

    const codeElement = screen.queryByTestId("code-code-0");
    expect(codeElement).not.toBeInTheDocument();

    const systemElement = screen.queryByTestId("code-system-0");
    expect(systemElement).not.toBeInTheDocument();
  });

  it("Item has a code", () => {
    item.code = [{ code: "1", display: "Test", system: "http://test.no" }];
    const treeState = {
      qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
      qItems: { "1": item } as Items,
    } as TreeState;
    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <Codes linkId="1" itemValidationErrors={[]} />
      </TreeContext.Provider>,
    );

    const addCode = screen.getByTestId("code-add");
    expect(addCode).toBeInTheDocument();

    const removeCode = screen.queryByTestId("code-remove-0");
    expect(removeCode).toBeInTheDocument();

    const displayElement = screen.getByTestId("code-display-0");
    expect(displayElement).toBeInTheDocument();
    expect(displayElement).toHaveValue("Test");

    const codeElement = screen.getByTestId("code-code-0");
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveValue("1");

    const systemElement = screen.getByTestId("code-system-0");
    expect(systemElement).toBeInTheDocument();
    expect(systemElement).toHaveValue("http://test.no");
  });

  it("User clicks Add Code button, adds an empty code to the item", async () => {
    const treeState = {
      qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
      qItems: { "1": item } as Items,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <Codes linkId="1" itemValidationErrors={[]} />
      </TreeContext.Provider>,
    );

    const addCodeButton = screen.getByTestId("code-add");
    await userEvent.click(addCodeButton);

    expect(addItemCodeActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ code: "" }),
    );
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ display: "" }),
    );
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ system: expect.any(String) }),
    );
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );
  });

  it("User removes code in position 2", async () => {
    item.code = [
      {
        code: "1",
        display: "Test 1",
        system: "urn:uuid:ee22f4af-9ad4-4c0c-f51d-eaac189ba4d2",
      },
      {
        code: "2",
        display: "Test 2",
        system: "urn:uuid:74e04dff-3081-4d16-853e-bf8ad92a7ee4",
      },
    ];
    const treeState = {
      qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
      qItems: { "1": item } as Items,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <Codes linkId="1" itemValidationErrors={[]} />
      </TreeContext.Provider>,
    );

    const removeCode = screen.getByTestId("code-remove-1");

    await userEvent.click(removeCode);

    expect(deleteItemCodeActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(deleteItemCodeActionMock.mock.calls[0][1]).toEqual(1);
  });

  describe("Display", () => {
    it("User edits display", async () => {
      item.code = [
        {
          code: "",
          display: "",
          system: "urn:uuid:ee22f4af-9ad4-4c0c-f51d-eaac189ba4d2",
        },
      ];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const displayElement = screen.getByTestId("code-display-0");

      await userEvent.type(displayElement, "Testing");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock.mock.calls[0][0]).toEqual(
        item.linkId,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][1]).toEqual(0);
      expect(updateItemCodePropertyActionMock.mock.calls[0][2]).toEqual(
        ICodingProperty.display,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][3]).toEqual(
        "Testing",
      );
    });

    it("User edits display when code system is tableColumn", async () => {
      item.code = [{ code: "", display: "", system: ICodeSystem.tableColumn }];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const displayElement = screen.getByTestId("code-display-0");

      await userEvent.type(displayElement, "Testing");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock).not.toBeCalled();
    });
  });

  describe("Code", () => {
    it("User edits code", async () => {
      item.code = [
        {
          code: "",
          display: "",
          system: "urn:uuid:ee22f4af-9ad4-4c0c-f51d-eaac189ba4d2",
        },
      ];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const codeElement = screen.getByTestId("code-code-0");

      await userEvent.type(codeElement, "test-1");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock.mock.calls[0][0]).toEqual(
        item.linkId,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][1]).toEqual(0);
      expect(updateItemCodePropertyActionMock.mock.calls[0][2]).toEqual(
        ICodingProperty.code,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][3]).toEqual(
        "test-1",
      );
    });

    it("User edits code in position 2", async () => {
      item.code = [
        {
          code: "1",
          display: "Test 1",
          system: "urn:uuid:ee22f4af-9ad4-4c0c-f51d-eaac189ba4d2",
        },
        {
          code: "2",
          display: "Test 2",
          system: "urn:uuid:74e04dff-3081-4d16-853e-bf8ad92a7ee4",
        },
      ];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const codeElement = screen.getByTestId("code-code-1");

      await userEvent.clear(codeElement);
      await userEvent.type(codeElement, "test-2");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock.mock.calls[0][0]).toEqual(
        item.linkId,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][1]).toEqual(1);
      expect(updateItemCodePropertyActionMock.mock.calls[0][2]).toEqual(
        ICodingProperty.code,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][3]).toEqual(
        "test-2",
      );
    });

    test.each([
      ICodeSystem.tableColumnName,
      ICodeSystem.tableOrderingColumn,
      ICodeSystem.tableOrderingFunctions,
      ICodeSystem.tableColumn,
    ])(`User edits code when system is a table config %p`, async (system) => {
      item.code = [{ code: "", display: "", system: system }];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const codeElement = screen.getByTestId("code-code-0");

      await userEvent.type(codeElement, "test-1");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock).not.toBeCalled();
    });
  });

  describe("System", () => {
    it("User edits system", async () => {
      item.code = [
        {
          code: "",
          display: "",
          system: "urn:uuid:ee22f4af-9ad4-4c0c-f51d-eaac189ba4d2",
        },
      ];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const systemElement = screen.getByTestId("code-system-0");

      await userEvent.clear(systemElement);
      await userEvent.type(systemElement, "http://test.no");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock.mock.calls[0][0]).toEqual(
        item.linkId,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][1]).toEqual(0);
      expect(updateItemCodePropertyActionMock.mock.calls[0][2]).toEqual(
        ICodingProperty.system,
      );
      expect(updateItemCodePropertyActionMock.mock.calls[0][3]).toEqual(
        "http://test.no",
      );
    });

    test.each([
      ICodeSystem.tableColumnName,
      ICodeSystem.tableOrderingColumn,
      ICodeSystem.tableOrderingFunctions,
      ICodeSystem.tableColumn,
    ])(`User edits system when system is a table config %p`, async (system) => {
      item.code = [{ code: "", display: "", system: system }];
      const treeState = {
        qOrder: [{ linkId: "1", items: [] }] as OrderItem[],
        qItems: { "1": item } as Items,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <Codes linkId="1" itemValidationErrors={[]} />
        </TreeContext.Provider>,
      );

      const systemElement = screen.getByTestId("code-system-0");

      await userEvent.clear(systemElement);
      await userEvent.type(systemElement, "http://test.no");
      await userEvent.tab(); // blur

      expect(updateItemCodePropertyActionMock).not.toBeCalled();
    });
  });
});
