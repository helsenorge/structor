import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { Coding, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import ButtonsPresentationView from "../ButtonsPresentationView";

const buttonCoding = (code: string): Coding => {
  return {
    system: IValueSetSystem.presentationbuttonsValueSet,
    code: code,
  } as Coding;
};

const buttonExtension = (code: string): Extension => {
  return {
    url: IExtensionType.presentationbuttons,
    valueCoding: buttonCoding(code),
  } as Extension;
};

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
    );
    expect(stickyElement).toBeChecked();
    expect(stickyElement.getAttribute("value")).toBe("sticky");
  });

  it("Has none code in extension, correct value is selected", () => {
    const noneExtension = buttonExtension("none");
    const treeState = {
      qMetadata: { extension: [noneExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ButtonsPresentationView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const noneElement = screen.getByLabelText("No button bar");
    expect(noneElement).toBeChecked();
    expect(noneElement.getAttribute("value")).toBe("none");

    const defaultElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
    );
    expect(defaultElement).not.toBeChecked();
  });

  it("Has static code in extension, correct value is selected", () => {
    const extension = buttonExtension("static");
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
    );
    expect(staticElement).toBeChecked();
    expect(staticElement.getAttribute("value")).toBe("static");

    const defaultElement = screen.getByLabelText(
      "Floating at the bottom of the screen (standard setting)",
    );
    expect(defaultElement).not.toBeChecked();
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
    );
    expect(defaultElement).toBeChecked();
    expect(defaultElement.getAttribute("value")).toBe("sticky");

    const staticElement = screen.getByLabelText(
      "Static (at the bottom of the questionnaire)",
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
          valueCoding: buttonCoding("static"),
        }),
      ]),
    );
  });
});
