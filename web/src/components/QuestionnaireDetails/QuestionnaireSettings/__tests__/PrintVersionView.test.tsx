import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { Extension, Reference } from "fhir/r4";
import { render, screen } from "@testing-library/react";
import PrintVersionView from "../PrintVersionView";
import {
  ErrorLevel,
  ValidationType,
} from "src/components/Validation/validationTypes";
import { ValidationError } from "src/utils/validationUtils";
import userEvent from "@testing-library/user-event";

const printVersionValueReference = (value: string): Reference => {
  return {
    reference: value,
  } as Reference;
};

const printVersionExtension = (value: string): Extension => {
  return {
    url: IExtensionType.printVersion,
    valueReference: printVersionValueReference(value),
  } as Extension;
};

describe("PrintVersionView", () => {
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

  it("metadata has no print version", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <PrintVersionView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const printVersion = screen.getByPlaceholderText("For example Binary/35");
    expect(printVersion.getAttribute("value")).toBe("");
  });

  it("Print version has value, and has validation error", () => {
    const extension = printVersionExtension("test");
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    const { container } = render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <PrintVersionView
          errors={[
            {
              errorLevel: ErrorLevel.warning,
              errorProperty: ValidationType.binary,
              errorReadableText:
                "In case of Helsenorge, reference to print version must start with 'Binary/<print version's Id>",
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
        "In case of Helsenorge, reference to print version must start with 'Binary/<print version's Id>",
      ),
    ).toBeInTheDocument();
  });

  it("User writers in to the print version", async () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <PrintVersionView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const printVersion = screen.getByPlaceholderText("For example Binary/35");
    await userEvent.type(printVersion, "Testing");
    await userEvent.tab(); // blur

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.printVersion,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valueReference: printVersionValueReference("Testing"),
        }),
      ]),
    );
  });

  it("User removes the print version", async () => {
    const extension = printVersionExtension("Testing");
    const treeState = {
      qMetadata: { extension: [extension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <PrintVersionView
          errors={[]}
          updateExtension={updateExtensionMock}
          removeExtension={removeExtensionMock}
        />
      </TreeContext.Provider>,
    );

    const printVersion = screen.getByPlaceholderText("For example Binary/35");
    await userEvent.clear(printVersion);
    await userEvent.tab(); // blur

    expect(removeExtensionMock.mock.calls[0]).toEqual([
      IExtensionType.printVersion,
    ]);
  });
});
