import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import {
  ICodeSystem,
  IExtensionType,
  WorkflowCode,
} from "src/types/IQuestionnareItemType";
import { CodeableConcept, Coding } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import WorkflowView from "../WorkflowView";
import { updateQuestionnaireMetadataAction } from "src/store/treeStore/treeActions";
import { Mock } from "vitest";

const workflowCode = {
  system: IExtensionType.workflow,
  code: WorkflowCode.workflow,
  display: "Workflow Setting",
} as Coding;
const workflowCodeableConcept = {
  coding: [
    {
      system: ICodeSystem.workflow,
      code: WorkflowCode.request,
      display: "Henvendelse",
    },
  ],
} as CodeableConcept;

describe("WorkflowView", () => {
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

  it("metadata has no useContext", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <WorkflowView />
      </TreeContext.Provider>,
    );

    const workflow = screen.getByRole("checkbox");
    expect(workflow).not.toBeChecked();
  });

  it("metadata has workflow useContext", () => {
    const treeState = {
      qMetadata: {
        useContext: [
          { code: workflowCode, valueCodeableConcept: workflowCodeableConcept },
        ],
      } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <WorkflowView />
      </TreeContext.Provider>,
    );

    const workflow = screen.getByRole("checkbox");
    expect(workflow).toBeChecked();
  });

  it("User selects workflow request", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <WorkflowView />
      </TreeContext.Provider>,
    );

    const workflow = screen.getByRole("checkbox");
    fireEvent.click(workflow);

    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([IQuestionnaireMetadataType.useContext]),
    );
    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            valueCodeableConcept: workflowCodeableConcept,
          }),
        ]),
      ]),
    );
    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          expect.objectContaining({
            code: workflowCode,
          }),
        ]),
      ]),
    );
  });

  it("User removes the workflow request", () => {
    const treeState = {
      qMetadata: {
        useContext: [
          { code: workflowCode, valueCodeableConcept: workflowCodeableConcept },
        ],
      } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <WorkflowView />
      </TreeContext.Provider>,
    );

    const workflow = screen.getByRole("checkbox");
    fireEvent.click(workflow);

    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([IQuestionnaireMetadataType.useContext]),
    );
    expect(updateMetadataActionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([expect.arrayContaining([])]),
    );
  });
});
