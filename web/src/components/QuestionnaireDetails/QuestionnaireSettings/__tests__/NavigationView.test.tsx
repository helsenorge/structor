import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { CodeableConcept, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import NavigationView from "../NavigationView";

const navigatorCodeableConcept = {
  coding: [
    {
      system: IExtensionType.navigatorCodeSystem,
      code: "navigator",
    },
  ],
} as CodeableConcept;

const navigatorExtension = {
  url: IExtensionType.navigator,
  valueCodeableConcept: navigatorCodeableConcept,
} as Extension;

describe("NavigationView", () => {
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

  it("metadata has no Navigator", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <NavigationView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const navigator = screen.getByRole("checkbox");
    expect(navigator).not.toBeChecked();
  });

  it("metadata has Navigator", () => {
    const treeState = {
      qMetadata: { extension: [navigatorExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <NavigationView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const navigator = screen.getByRole("checkbox");
    expect(navigator).toBeChecked();
  });

  it("User selects Navigator", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <NavigationView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const navigator = screen.getByRole("checkbox");
    fireEvent.click(navigator);

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.navigator,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valueCodeableConcept: navigatorCodeableConcept,
        }),
      ]),
    );
  });

  it("User removes the Navigator", () => {
    const treeState = {
      qMetadata: { extension: [navigatorExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <NavigationView
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const navigator = screen.getByRole("checkbox");
    fireEvent.click(navigator);

    expect(removeExtensionMock.mock.calls[0]).toEqual([
      IExtensionType.navigator,
    ]);
  });
});
