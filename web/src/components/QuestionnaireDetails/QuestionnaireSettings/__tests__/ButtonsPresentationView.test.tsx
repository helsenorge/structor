import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import ButtonsPresentationView from "../ButtonsPresentationView";

describe("ButtonsPresentationView", () => {
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
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    expect(
      screen.getByText(
        "Floating at the bottom of the screen (standard setting)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("No button bar")).toBeInTheDocument();
    expect(
      screen.getByText("Static (at the bottom of the questionnaire)"),
    ).toBeInTheDocument();
  });

  it("If no extension, default value is sticky", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const stickyElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
      { selector: "input" },
    );
    expect(stickyElement.getAttribute("checked")).toBeDefined();
    expect(stickyElement.getAttribute("value")).toBe("sticky");
  });

  it("Has none code in extension, correct value is selected", () => {
    const extension = {
      url: IExtensionType.presentationbuttons,
      valueCoding: {
        url: IValueSetSystem.presentationbuttonsValueSet,
        code: "none",
      },
    } as Extension;
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const noneElement = screen.getByLabelText("No button bar", {
      selector: "input",
    });
    expect(noneElement.getAttribute("checked")).toBeDefined();
    expect(noneElement.getAttribute("value")).toBe("none");

    const defaultElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });

  it("Has static code in extension, correct value is selected", () => {
    const extension = {
      url: IExtensionType.presentationbuttons,
      valueCoding: {
        url: IValueSetSystem.presentationbuttonsValueSet,
        code: "static",
      },
    } as Extension;
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const staticElement = screen.getByLabelText(
      "Static (at the bottom of the questionnaire)",
      {
        selector: "input",
      },
    );
    expect(staticElement.getAttribute("checked")).toBeDefined();
    expect(staticElement.getAttribute("value")).toBe("static");

    const defaultElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });

  it("Default, select Optional", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const defaultElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
      { selector: "input" },
    );
    expect(defaultElement.getAttribute("checked")).toBeDefined();
    expect(defaultElement.getAttribute("value")).toBe("sticky");

    const staticElement = screen.getByLabelText(
      "Static (at the bottom of the questionnaire)",
      {
        selector: "input",
      },
    );
    fireEvent.click(staticElement);

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.presentationbuttons,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valueCoding: {
            system: IValueSetSystem.presentationbuttonsValueSet,
            code: "static",
          },
        }),
      ]),
    );
    expect(staticElement.getAttribute("checked")).toBeDefined();
    expect(staticElement.getAttribute("value")).toBe("static");

    expect(defaultElement.getAttribute("checked")).toBeFalsy();
  });
});
