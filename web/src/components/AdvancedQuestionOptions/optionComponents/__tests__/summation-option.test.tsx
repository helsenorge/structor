import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { ICodeSystem, IItemProperty } from "src/types/IQuestionnareItemType";
import { QuestionnaireItem } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  addItemCodeAction,
  updateItemAction,
} from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import { SummationOption } from "../summation-option";
import { ItemControlType } from "src/helpers/itemControl";
import { ScoringFormulaCodes } from "src/types/scoringFormulas";

const scoreCode = {
  code: ItemControlType.score,
  display: "score",
  system: ICodeSystem.score,
};
const sectionScore = {
  code: ScoringFormulaCodes.sectionScore,
  display: "Section score",
  system: ICodeSystem.scoringFormulas,
};
const totalScore = {
  code: ScoringFormulaCodes.totalScore,
  display: "Total score",
  system: ICodeSystem.scoringFormulas,
};

describe("SummationOption", () => {
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

  it("Shows options", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={{} as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    expect(screen.getByText("Not set")).toBeInTheDocument();
    expect(screen.getByText("Section score")).toBeInTheDocument();
    expect(screen.getByText("Total score")).toBeInTheDocument();
  });

  it("item does not have any scoring code, default", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={{} as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    const notSet = screen.getByLabelText("Not set");
    expect(notSet).toBeChecked();
    expect(notSet.getAttribute("value")).toBe("0");
  });

  it("Item has section scoring", () => {
    const item = { code: [scoreCode, sectionScore] } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={item} />
      </TreeContext.Provider>,
    );

    const notSet = screen.getByLabelText("Not set");
    expect(notSet).not.toBeChecked();

    const section = screen.getByLabelText("Section score");
    expect(section).toBeChecked();
    expect(section.getAttribute("value")).toBe("SS");
  });

  it("Item has total scoring", () => {
    const item = { code: [scoreCode, totalScore] } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={item} />
      </TreeContext.Provider>,
    );

    const notSet = screen.getByLabelText("Not set");
    expect(notSet).not.toBeChecked();

    const section = screen.getByLabelText("Total score");
    expect(section).toBeChecked();
    expect(section.getAttribute("value")).toBe("TS");
  });

  it("User selects section score", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={{ linkId: "1" } as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    const section = screen.getByLabelText("Section score");
    fireEvent.click(section);

    expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
    expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);
    expect(addItemCodeActionMock.mock.calls[0][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(scoreCode);
    expect(addItemCodeActionMock.mock.calls[1][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[1][1]).toEqual(sectionScore);
  });

  it("User selects total score", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={{ linkId: "1" } as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    const total = screen.getByLabelText("Total score");
    fireEvent.click(total);

    expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
    expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);
    expect(addItemCodeActionMock.mock.calls[0][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(scoreCode);
    expect(addItemCodeActionMock.mock.calls[1][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[1][1]).toEqual(totalScore);
  });

  it("User selects Not Set in scoring", () => {
    const item = {
      linkId: "1",
      type: "integer",
      code: [scoreCode, sectionScore],
    } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <SummationOption item={item} />
      </TreeContext.Provider>,
    );

    const notSet = screen.getByLabelText("Not set");
    fireEvent.click(notSet);

    expect(addItemCodeActionMock).not.toBeCalled();
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
    expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);
  });
});
