import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import {
  ICodeSystem,
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { QuestionnaireItem } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  addItemCodeAction,
  updateItemAction,
} from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import ViewOption from "../view-option";
import {
  ChoiceRenderOptionCodes,
  RenderingOptionsEnum,
} from "src/helpers/codeHelper";

const displayFormAndPDF = {
  code: RenderingOptionsEnum.Default,
  display: "Default",
  system: ICodeSystem.renderOptionsCodeSystem,
};
const displayOnlyPDF = {
  code: RenderingOptionsEnum.KunPdf,
  display: "KunPdf",
  system: ICodeSystem.renderOptionsCodeSystem,
};
const displayOnlyForm = {
  code: RenderingOptionsEnum.KunSkjemautfyller,
  display: "KunSkjemautfyller",
  system: ICodeSystem.renderOptionsCodeSystem,
};
const hideDisplay = {
  url: IExtensionType.hidden,
  valueBoolean: true,
};
const displayChoiceDefault = {
  code: ChoiceRenderOptionCodes.Default,
  display: "Show only answered options",
  system: ICodeSystem.choiceRenderOptions,
};
const displayChoiceFull = {
  code: ChoiceRenderOptionCodes.Full,
  display: "Full display",
  system: ICodeSystem.choiceRenderOptions,
};
const displayChoiceCompact = {
  code: ChoiceRenderOptionCodes.Compact,
  display: "Compact display",
  system: ICodeSystem.choiceRenderOptions,
};

describe("ViewOption", () => {
  vi.mock("src/store/treeStore/treeActions");
  const updateItemActionMock = updateItemAction as Mock;
  const addItemCodeActionMock = addItemCodeAction as Mock;
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

  beforeEach(() => {
    updateItemActionMock.mockClear();
    addItemCodeActionMock.mockClear();
  });
  describe("Choose if/where the component should be displayed", () => {
    it("Shows options", () => {
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={{} as QuestionnaireItem} />
        </TreeContext.Provider>,
      );

      expect(
        screen.getByText("Display in form filler and PDF"),
      ).toBeInTheDocument();
      expect(screen.getByText("Display only in PDF")).toBeInTheDocument();
      expect(
        screen.getByText("Display only in form filler"),
      ).toBeInTheDocument();
    });

    it("item does not have any display option, default", () => {
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={{} as QuestionnaireItem} />
        </TreeContext.Provider>,
      );

      const show = screen.getByLabelText("Display in form filler and PDF");
      expect(show).toBeChecked();
      expect(show.getAttribute("value")).toBe(RenderingOptionsEnum.Default);
    });

    it("Item has code Display in form filler and PDF", () => {
      const item = { code: [displayFormAndPDF] } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const show = screen.getByLabelText("Display in form filler and PDF");
      expect(show).toBeChecked();
      expect(show.getAttribute("value")).toBe(RenderingOptionsEnum.Default);
    });

    it("Item has code Display only PDF", () => {
      const item = { code: [displayOnlyPDF] } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const onlyPdf = screen.getByLabelText("Display only in PDF");
      expect(onlyPdf).toBeChecked();
      expect(onlyPdf.getAttribute("value")).toBe(RenderingOptionsEnum.KunPdf);
    });

    it("Item has code Display only in form filler", () => {
      const item = { code: [displayOnlyForm] } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const onlyForm = screen.getByLabelText("Display only in form filler");
      expect(onlyForm).toBeChecked();
      expect(onlyForm.getAttribute("value")).toBe(
        RenderingOptionsEnum.KunSkjemautfyller,
      );
    });

    it("Item has extension hide display", () => {
      const item = { extension: [hideDisplay] } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const notSet = screen.getByLabelText("Hide in form filler and PDF");
      expect(notSet).toBeChecked();
      expect(notSet.getAttribute("value")).toBe(RenderingOptionsEnum.Hidden);
    });

    it("User changes to Display Only in PDF", () => {
      const item = {
        linkId: "1",
        code: [displayFormAndPDF],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const onlyPdf = screen.getByLabelText("Display only in PDF");
      fireEvent.click(onlyPdf);

      expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[0][1]).toEqual(
        IItemProperty.extension,
      );
      expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);

      expect(updateItemActionMock.mock.calls[1][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[1][1]).toEqual(IItemProperty.code);
      expect(updateItemActionMock.mock.calls[1][2]).toEqual([]);

      expect(addItemCodeActionMock.mock.calls[0][0]).toEqual(item.linkId);
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ code: displayOnlyPDF.code }),
      );
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ display: displayOnlyPDF.display }),
      );
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ system: displayOnlyPDF.system }),
      );
    });

    it("User changes to Hide in form filler and PDF", () => {
      const item = {
        linkId: "1",
        code: [displayFormAndPDF],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const hide = screen.getByLabelText("Hide in form filler and PDF");
      fireEvent.click(hide);

      expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[0][1]).toEqual(
        IItemProperty.extension,
      );
      expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);

      expect(updateItemActionMock.mock.calls[1][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[1][1]).toEqual(IItemProperty.code);
      expect(updateItemActionMock.mock.calls[1][2]).toEqual([]);

      expect(updateItemActionMock.mock.calls[2][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[2][1]).toEqual(
        IItemProperty.extension,
      );
      expect(updateItemActionMock.mock.calls[2][2]).toEqual(
        expect.arrayContaining([hideDisplay]),
      );
    });
  });

  describe("Choose whether all answer options should be displayed in PDF", () => {
    test.each([
      IQuestionnaireItemType.string,
      IQuestionnaireItemType.text,
      IQuestionnaireItemType.integer,
      IQuestionnaireItemType.decimal,
      IQuestionnaireItemType.dateTime,
      IQuestionnaireItemType.date,
      IQuestionnaireItemType.boolean,
      IQuestionnaireItemType.group,
      IQuestionnaireItemType.quantity,
    ])(`Answer option displayed, should be not displayed %p`, (type) => {
      const item = { type: type } as QuestionnaireItem;

      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      expect(
        screen.queryByLabelText("Show only answered options"),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Full display")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Compact display"),
      ).not.toBeInTheDocument();
    });

    test.each([
      IQuestionnaireItemType.choice,
      IQuestionnaireItemType.openChoice,
    ])(`Answer option displayed, should be displayed %p`, (type) => {
      const item = { type: type } as QuestionnaireItem;

      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      expect(
        screen.getByText("Show only answered options"),
      ).toBeInTheDocument();
      expect(screen.getByText("Full display")).toBeInTheDocument();
      expect(screen.getByText("Compact display")).toBeInTheDocument();
    });

    it("item choice does not have any display option, default", () => {
      const item = { type: IQuestionnaireItemType.choice } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const def = screen.getByLabelText("Show only answered options");
      expect(def).toBeChecked();
      expect(def.getAttribute("value")).toBe(ChoiceRenderOptionCodes.Default);
    });

    it("Item choice has code Show only answered options", () => {
      const item = {
        type: IQuestionnaireItemType.choice,
        code: [displayChoiceDefault],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const def = screen.getByLabelText("Show only answered options");
      expect(def).toBeChecked();
      expect(def.getAttribute("value")).toBe(ChoiceRenderOptionCodes.Default);
    });

    it("Item choice has code Full display", () => {
      const item = {
        type: IQuestionnaireItemType.choice,
        code: [displayChoiceFull],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const full = screen.getByLabelText("Full display");
      expect(full).toBeChecked();
      expect(full.getAttribute("value")).toBe(ChoiceRenderOptionCodes.Full);
    });

    it("Item choice has code Compact display", () => {
      const item = {
        type: IQuestionnaireItemType.choice,
        code: [displayChoiceCompact],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const compact = screen.getByLabelText("Compact display");
      expect(compact).toBeChecked();
      expect(compact.getAttribute("value")).toBe(
        ChoiceRenderOptionCodes.Compact,
      );
    });

    it("User changes to Compact display", () => {
      const item = {
        type: IQuestionnaireItemType.choice,
        code: [displayChoiceFull, displayOnlyForm],
      } as QuestionnaireItem;
      render(
        <TreeContext.Provider
          value={{ state: {} as TreeState, dispatch: vi.fn() }}
        >
          <ViewOption item={item} />
        </TreeContext.Provider>,
      );

      const compact = screen.getByLabelText("Compact display");
      fireEvent.click(compact);

      expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
      expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
      expect(updateItemActionMock.mock.calls[0][2]).toEqual(
        expect.arrayContaining([displayOnlyForm]),
      );

      expect(addItemCodeActionMock.mock.calls[0][0]).toEqual(item.linkId);
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ code: displayChoiceCompact.code }),
      );
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ display: displayChoiceCompact.display }),
      );
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ system: displayChoiceCompact.system }),
      );
      expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({ id: expect.any(String) }),
      );
    });
  });
});
