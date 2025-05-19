import AuthenticationRequirementView from "../AuthenticationRequirementView";
import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AuthenticationRequirementView", () => {
  const updateExtensionMock = vi.fn();
  const removeExtensionMock = vi.fn();

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
    updateExtensionMock.mockClear();
    removeExtensionMock.mockClear();
  });

  it("Shows options", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    expect(screen.getByText("Required (standard setting)")).toBeInTheDocument();
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("If no extension, default value is Required", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const requiredElement = screen.getByLabelText(
      "Required (standard setting)",
      { selector: "input" },
    );
    expect(requiredElement.getAttribute("checked")).toBeDefined();
    expect(requiredElement.getAttribute("value")).toBe("3");
  });

  it("Has Ananymous, correct value is selected", () => {
    const extension = {
      url: IExtensionType.authenticationRequirement,
      valueCoding: {
        url: IValueSetSystem.authenticationRequirementValueSet,
        code: "1",
      },
    } as Extension;
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const anonymousElement = screen.getByLabelText("Anonymous", {
      selector: "input",
    });
    expect(anonymousElement.getAttribute("checked")).toBeDefined();
    expect(anonymousElement.getAttribute("value")).toBe("1");

    const defaultElement = screen.getByLabelText(
      "Required (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });

  it("Has Optional, correct value is selected", () => {
    const extension = {
      url: IExtensionType.authenticationRequirement,
      valueCoding: {
        url: IValueSetSystem.authenticationRequirementValueSet,
        code: "2",
      },
    } as Extension;
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const optionalElement = screen.getByLabelText("Optional", {
      selector: "input",
    });
    expect(optionalElement.getAttribute("checked")).toBeDefined();
    expect(optionalElement.getAttribute("value")).toBe("2");

    const defaultElement = screen.getByLabelText(
      "Required (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });

  it("Default, select Optional", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const defaultElement = screen.getByLabelText(
      "Required (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeDefined();
    expect(defaultElement.getAttribute("value")).toBe("3");

    const optionalElement = screen.getByLabelText("Optional", {
      selector: "input",
    });
    fireEvent.click(optionalElement);

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.authenticationRequirement,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valueCoding: {
            system: IValueSetSystem.authenticationRequirementValueSet,
            code: "2",
          },
        }),
      ]),
    );
    expect(optionalElement.getAttribute("checked")).toBeDefined();
    expect(optionalElement.getAttribute("value")).toBe("2");

    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });
});
