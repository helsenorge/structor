import { Extension } from "fhir/r4";
import { TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import { IExtensionType } from "src/types/IQuestionnareItemType";
import { validateQuestionnaireSettings } from "../settingsValidation";
import { ErrorLevel } from "../../validationTypes";

describe("Questionnaire settings validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  it("Endpoint and print version does not have a reference (reference empty)", () => {
    const endpoint = {
      url: IExtensionType.endpoint,
      valueReference: { reference: "" },
    } as Extension;
    const printVersion = {
      url: IExtensionType.printVersion,
      valueReference: { reference: "" },
    } as Extension;
    const treeState = {
      qMetadata: {
        extension: [endpoint, printVersion],
      } as IQuestionnaireMetadata,
    } as TreeState;

    const validationErrors = validateQuestionnaireSettings(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(2);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(validationErrors[1].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "Cannot find the Endpoint's reference",
    ]);
    expect(translatationMock.mock.calls[1]).toEqual([
      "Cannot find the print version's reference",
    ]);
  });

  it("Endpoint and print version are correct", () => {
    const endpoint = {
      url: IExtensionType.endpoint,
      valueReference: { reference: "Endpoint/35" },
    } as Extension;
    const printVersion = {
      url: IExtensionType.printVersion,
      valueReference: { reference: "Binary/101" },
    } as Extension;
    const treeState = {
      qMetadata: {
        extension: [endpoint, printVersion],
      } as IQuestionnaireMetadata,
    } as TreeState;

    const validationErrors = validateQuestionnaireSettings(
      translatationMock,
      treeState,
    );

    expect(validationErrors.length).toBe(0);
  });

  describe("Helsenorge Endpoint", () => {
    it("Endpoint does not have a reference (reference empty)", () => {
      const endpoint = {
        url: IExtensionType.endpoint,
        valueReference: { reference: "" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [endpoint] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Cannot find the Endpoint's reference",
      ]);
    });

    it("Endpoint does not have a reference (no valueReference)", () => {
      const endpoint = { url: IExtensionType.endpoint } as Extension;
      const treeState = {
        qMetadata: { extension: [endpoint] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Cannot find the Endpoint's reference",
      ]);
    });

    it("Endpoint does not start with Endpoint/", () => {
      const endpoint = {
        url: IExtensionType.endpoint,
        valueReference: { reference: "test" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [endpoint] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls[0]).toEqual([
        "In case of Helsenorge, endpoint must start with 'Endpoint/<Endpoint's Id>'",
      ]);
    });

    it("Endpoint has wrong format", () => {
      const endpoint = {
        url: IExtensionType.endpoint,
        valueReference: { reference: "Endpoint/test/1" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [endpoint] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Endpoint does not have an valid id 'Endpoint/<Endpoint's Id>'",
      ]);
    });
  });

  describe("Print version", () => {
    it("Print version does not have a reference (reference empty)", () => {
      const printVersion = {
        url: IExtensionType.printVersion,
        valueReference: { reference: "" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [printVersion] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Cannot find the print version's reference",
      ]);
    });

    it("Print version does not have a reference (no valueReference)", () => {
      const printVersion = { url: IExtensionType.printVersion } as Extension;
      const treeState = {
        qMetadata: { extension: [printVersion] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Cannot find the print version's reference",
      ]);
    });

    it("Print version does not start with Binary/", () => {
      const printVersion = {
        url: IExtensionType.printVersion,
        valueReference: { reference: "test" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [printVersion] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls[0]).toEqual([
        "In case of Helsenorge, reference to print version must start with 'Binary/<print version's Id>'",
      ]);
    });

    it("Print version has wrong format", () => {
      const printVersion = {
        url: IExtensionType.printVersion,
        valueReference: { reference: "Binary/test/1" },
      } as Extension;
      const treeState = {
        qMetadata: { extension: [printVersion] } as IQuestionnaireMetadata,
      } as TreeState;

      const validationErrors = validateQuestionnaireSettings(
        translatationMock,
        treeState,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Print version does not have an valid id 'Binary/<print version's Id>'",
      ]);
    });
  });
});
