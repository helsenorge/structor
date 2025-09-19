import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { Extension, Reference } from "fhir/r4";
import { render, screen } from "@testing-library/react";
import EndpointView from "../EndpointView";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";
import { ValidationError } from "src/utils/validationUtils";
import userEvent from "@testing-library/user-event";

const endpointValueReference = (value: string): Reference => {
  return {
    reference: value,
  } as Reference;
};

const endpointExtension = (value: string): Extension => {
  return {
    url: IExtensionType.endpoint,
    valueReference: endpointValueReference(value),
  } as Extension;
};

describe("EndpointView", () => {
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

  it("metadata has no endpoint", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <EndpointView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const endpoint = screen.getByPlaceholderText("For example Endpoint/35");
    expect(endpoint.getAttribute("value")).toBe("");
  });

  it("Endpoint has value, and has validation error", () => {
    const extension = endpointExtension("test");
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    const { container } = render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <EndpointView
          errors={[
            {
              errorLevel: ErrorLevel.warning,
              errorProperty: ValidationType.endpoint,
              errorReadableText:
                "In case of Helsenorge, endpoint must start with 'Endpoint/<Endpoint's Id>'",
            } as ValidationError,
          ]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    expect(container.getElementsByClassName("warning-highlight").length).toBe(
      1,
    );
    expect(container.getElementsByClassName("warning-text").length).toBe(1);
    expect(
      screen.getByText(
        "In case of Helsenorge, endpoint must start with 'Endpoint/<Endpoint's Id>'",
      ),
    ).toBeInTheDocument();
  });

  it("User writers in to the endpoint", async () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <EndpointView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const endpoint = screen.getByPlaceholderText("For example Endpoint/35");
    await userEvent.type(endpoint, "Testing");
    await userEvent.tab(); // blur

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.endpoint,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valueReference: endpointValueReference("Testing"),
        }),
      ]),
    );
  });

  it("User removes the Endpoint", async () => {
    const extension = endpointExtension("Testing");
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <EndpointView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const endpoint = screen.getByPlaceholderText("For example Endpoint/35");
    await userEvent.clear(endpoint);
    await userEvent.tab(); // blur

    expect(removeExtensionMock.mock.calls[0]).toEqual([
      IExtensionType.endpoint,
    ]);
  });
});
