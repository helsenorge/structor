import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import { ICodeSystem, IExtensionType } from "src/types/IQuestionnareItemType";
import { CodeableConcept, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import ProgressIndicatorView from "../ProgressIndicatorView";
import { VisibilityType } from "src/helpers/globalVisibilityHelper";
import { updateQuestionnaireMetadataAction } from "src/store/treeStore/treeActions";
import { Mock } from "vitest";

const progressCodeableConcept = {
  coding: [
    {
      system: ICodeSystem.progressIndicatorOptions,
      display: "Hide progress indicator",
      code: VisibilityType.hideProgress,
    },
  ],
} as CodeableConcept;

const progressExtension = {
  url: IExtensionType.globalVisibility,
  valueCodeableConcept: progressCodeableConcept,
} as Extension;

describe("ProgressIndicatorView", () => {
  vi.mock("src/store/treeStore/treeActions");
  const updateMetadataActionMock = updateQuestionnaireMetadataAction as Mock;
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
    updateMetadataActionMock.mockClear();
  });

  it("metadata has no Progress indicator", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ProgressIndicatorView />
      </TreeContext.Provider>,
    );

    const progress = screen.getByRole("checkbox");
    expect(progress).not.toBeChecked();
  });

  it("metadata has Progress indicator", () => {
    const treeState = {
      qMetadata: { extension: [progressExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ProgressIndicatorView />
      </TreeContext.Provider>,
    );

    const progress = screen.getByRole("checkbox");
    expect(progress).toBeChecked();
  });

  it("User selects Progress indicator", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ProgressIndicatorView />
      </TreeContext.Provider>,
    );

    const progress = screen.getByRole("checkbox");
    fireEvent.click(progress);

    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([IQuestionnaireMetadataType.extension]),
    );
    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            url: IExtensionType.globalVisibility,
          }),
        ]),
      ]),
    );

    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            valueCodeableConcept: progressCodeableConcept,
          }),
        ]),
      ]),
    );
  });

  it("User removes the Progress indicator", () => {
    const treeState = {
      qMetadata: { extension: [progressExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <ProgressIndicatorView />
      </TreeContext.Provider>,
    );

    const progress = screen.getByRole("checkbox");
    fireEvent.click(progress);

    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([IQuestionnaireMetadataType.extension]),
    );
    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([expect.arrayContaining([])]),
    );
  });
});
