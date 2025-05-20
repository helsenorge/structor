import AuthenticationRequirementView from "../AuthenticationRequirementView";
import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { Coding, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";

const authenticationCoding = (code: string): Coding => {
  return {
    system: IValueSetSystem.authenticationRequirementValueSet,
    code: code,
  } as Coding;
};

const authenticationExtension = (code: string): Extension => {
  return {
    url: IExtensionType.authenticationRequirement,
    valueCoding: authenticationCoding(code),
  } as Extension;
};

describe("AuthenticationRequirementView", () => {
  const updateExtensionMock = vi.fn();

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
  });

  it("Shows options", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView updateExtension={updateExtensionMock} />
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
        <AuthenticationRequirementView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const requiredElement = screen.getByLabelText(
      "Required (standard setting)",
    );
    expect(requiredElement).toBeChecked();
    expect(requiredElement.getAttribute("value")).toBe("3");
  });

  it("Has Ananymous, correct value is selected", () => {
    const anonymousExtension = authenticationExtension("1");
    const treeState = {
      qMetadata: { extension: [anonymousExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const anonymousElement = screen.getByLabelText("Anonymous");
    expect(anonymousElement).toBeChecked();
    expect(anonymousElement.getAttribute("value")).toBe("1");

    const defaultElement = screen.getByLabelText("Required (standard setting)");
    expect(defaultElement).not.toBeChecked();
  });

  it("Has Optional, correct value is selected", () => {
    const optionalExtension = authenticationExtension("2");
    const treeState = {
      qMetadata: { extension: [optionalExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const optionalElement = screen.getByLabelText("Optional");
    expect(optionalElement).toBeChecked();
    expect(optionalElement.getAttribute("value")).toBe("2");

    const defaultElement = screen.getByLabelText("Required (standard setting)");
    expect(defaultElement).not.toBeChecked();
  });

  it("Default, select Optional", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <AuthenticationRequirementView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const defaultElement = screen.getByLabelText("Required (standard setting)");
    expect(defaultElement).toBeChecked();
    expect(defaultElement.getAttribute("value")).toBe("3");

    const optionalElement = screen.getByLabelText("Optional");
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
          valueCoding: authenticationCoding("2"),
        }),
      ]),
    );
  });
});
