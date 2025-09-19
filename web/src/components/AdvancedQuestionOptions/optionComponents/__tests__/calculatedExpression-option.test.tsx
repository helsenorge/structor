import { Extension, QuestionnaireItem } from "fhir/r4";
import { updateItemAction } from "src/store/treeStore/treeActions";
import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "src/types/IQuestionnareItemType";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock } from "vitest";
import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import CalculatedExpressionOption from "../calculatedExpression-option";
import { createError } from "src/components/Validation/validationHelper";
import { ValidationError } from "src/utils/validationUtils";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";

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

const calculatedExpression = {
  url: IExtensionType.calculatedExpression,
  valueString:
    "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
} as Extension;

describe("CalculatedExpressionOption", () => {
  let item = {} as QuestionnaireItem;
  beforeEach(() => {
    updateItemActionMock.mockClear();
    item = { linkId: "2", type: IQuestionnaireItemType.decimal };
  });

  it("Item does not have calculated expression", () => {
    const { container } = render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={false} errors={[]} />
      </TreeContext.Provider>,
    );

    const calculated = screen.getByTestId("calculation-formula-testid");
    expect(calculated).toBeInTheDocument();
    expect(calculated.getAttribute("value")).toBe(null);
  });

  it("Item has calculated expression", () => {
    item.extension = [calculatedExpression];
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={false} errors={[]} />
      </TreeContext.Provider>,
    );
    const calculated = screen.getByTestId("calculation-formula-testid");

    expect(calculated).toBeInTheDocument();
    expect(calculated).toHaveTextContent(
      "QuestionnaireResponse.descendants().where(linkId='1').answer.value.value / 100)",
    );
  });

  it("calculated expression is disabled", () => {
    item.extension = [calculatedExpression];
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={true} errors={[]} />
      </TreeContext.Provider>,
    );

    const calculated = screen.getByTestId("calculation-formula-testid");
    expect(calculated).toHaveAttribute("disabled");
  });

  it("calculated expression is not disabled", () => {
    item.extension = [calculatedExpression];
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={false} errors={[]} />
      </TreeContext.Provider>,
    );

    const calculated = screen.getByTestId("calculation-formula-testid");
    expect(calculated).not.toHaveAttribute("disabled");
  });

  it("User writes in a calculated expression", () => {
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={false} errors={[]} />
      </TreeContext.Provider>,
    );

    const calculated = screen.getByTestId("calculation-formula-testid");
    fireEvent.change(calculated, { target: { value: "Testing" } });

    expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(
      IItemProperty.extension,
    );
    expect(updateItemActionMock.mock.calls[0][2]).toEqual(
      expect.arrayContaining([
        { url: IExtensionType.calculatedExpression, valueString: "Testing" },
      ]),
    );
  });

  it("User removes calculated expression", () => {
    item.extension = [calculatedExpression];
    render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption item={item} disabled={false} errors={[]} />
      </TreeContext.Provider>,
    );

    const calculated = screen.getByTestId("calculation-formula-testid");
    fireEvent.change(calculated, { target: { value: "" } });

    expect(updateItemActionMock.mock.calls[0][0]).toEqual(item.linkId);
    expect(updateItemActionMock.mock.calls[0][1]).toEqual(
      IItemProperty.extension,
    );
    expect(updateItemActionMock.mock.calls[0][2]).toEqual(
      expect.arrayContaining([]),
    );
  });

  it("calculated expression has validation errors", () => {
    const validationError = {
      errorLevel: ErrorLevel.error,
      errorProperty: ValidationType.calculation,
      errorReadableText:
        "Calculation expression does not have an earlier question with LinkId 1'",
    } as ValidationError;
    item.extension = [calculatedExpression];
    const { container } = render(
      <TreeContext.Provider
        value={{ state: {} as TreeState, dispatch: vi.fn() }}
      >
        <CalculatedExpressionOption
          item={item}
          disabled={false}
          errors={[validationError]}
        />
      </TreeContext.Provider>,
    );

    expect(
      container.getElementsByClassName("error-highlight-box"),
    ).exist.toBeTruthy();
  });
});
