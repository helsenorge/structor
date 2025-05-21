import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import {
  ICodeSystem,
  IExtensionType,
  IItemProperty,
} from "src/types/IQuestionnareItemType";
import { QuestionnaireItem } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  addItemCodeAction,
  updateItemAction,
} from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import { ItemControlType } from "src/helpers/itemControl";
import { ScoringFormulaCodes } from "src/types/scoringFormulas";
import { ScoringOption } from "../scoring-option";

const scoreCode = {
  code: ItemControlType.score,
  display: "score",
  system: ICodeSystem.score,
};
const questionScore = {
  code: ScoringFormulaCodes.questionScore,
  display: "Question score",
  system: ICodeSystem.scoringFormulas,
};

describe("ScoringOption", () => {
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

  it("item does not have any scoring code, default", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <ScoringOption item={{} as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    const scoringField = screen.getByRole("checkbox");
    expect(scoringField).not.toBeChecked();
    expect(scoringField.getAttribute("value")).toBe(null);
  });

  it("Item has question scoring", () => {
    const item = { code: [scoreCode, questionScore] } as QuestionnaireItem;
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <ScoringOption item={item} />
      </TreeContext.Provider>,
    );

    const scoringField = screen.getByRole("checkbox");
    expect(scoringField).toBeChecked();
  });

  it("User selects question score", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <ScoringOption item={{ linkId: "1" } as QuestionnaireItem} />
      </TreeContext.Provider>,
    );

    const scoringField = screen.getByRole("checkbox");
    fireEvent.click(scoringField);

    expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
    expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);
    expect(addItemCodeActionMock.mock.calls[0][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[0][1]).toEqual(scoreCode);
    expect(addItemCodeActionMock.mock.calls[1][0]).toEqual("1");
    expect(addItemCodeActionMock.mock.calls[1][1]).toEqual(questionScore);
  });

  it("User removes scoring", () => {
    const item = {
      linkId: "1",
      type: "integer",
      code: [scoreCode, questionScore],
      answerOption: [
        {
          valueCoding: {
            code: "test_1",
            system: "urn:uuid:5802b664-f25e-4a5f-94f6-843d798fcab1",
            extension: [{ url: IExtensionType.ordinalValue, valueDecimal: 1 }],
          },
        },
        {
          valueCoding: {
            code: "test_2",
            system: "urn:uuid:5802b664-f25e-4a5f-94f6-843d798fcab1",
            extension: [{ url: IExtensionType.ordinalValue, valueDecimal: 2 }],
          },
        },
      ],
    } as QuestionnaireItem;

    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <ScoringOption item={item} />
      </TreeContext.Provider>,
    );

    const scoringField = screen.getByRole("checkbox");
    fireEvent.click(scoringField);

    expect(addItemCodeActionMock).not.toBeCalled();
    expect(updateItemActionMock.mock.calls[0][0]).toEqual("1");
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(IItemProperty.code);
    expect(updateItemActionMock.mock.calls[0][2]).toEqual([]);
    expect(updateItemActionMock.mock.calls[1][0]).toEqual("1");
    expect(updateItemActionMock.mock.calls[1][1]).toEqual(
      IItemProperty.answerOption,
    );
    expect(updateItemActionMock.mock.calls[1][2][0]).toEqual({
      valueCoding: {
        code: "test_1",
        extension: [],
        system: "urn:uuid:5802b664-f25e-4a5f-94f6-843d798fcab1",
      },
    });
    expect(updateItemActionMock.mock.calls[1][2][1]).toEqual({
      valueCoding: {
        code: "test_2",
        extension: [],
        system: "urn:uuid:5802b664-f25e-4a5f-94f6-843d798fcab1",
      },
    });
  });
});
