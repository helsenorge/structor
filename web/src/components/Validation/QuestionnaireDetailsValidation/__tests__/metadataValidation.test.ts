import { TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import { validateMetadata } from "../metadataValidation";
import { ErrorLevel } from "../../validationTypes";

describe("metadataValidation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  it("Metadata has no value, default validatation errors", () => {
    const treeState = { qMetadata: {} } as TreeState;

    const validationErrors = validateMetadata(translatationMock, treeState);

    expect(validationErrors.length).toBe(4);

    expect(translatationMock.mock.calls[0]).toEqual(
      expect.arrayContaining(["Form does not have an id"]),
    );
    expect(translatationMock.mock.calls[1]).toEqual(
      expect.arrayContaining(["Form does not have a title"]),
    );
    expect(translatationMock.mock.calls[2]).toEqual(
      expect.arrayContaining(["Form does not have a technical name"]),
    );
    expect(translatationMock.mock.calls[3]).toEqual(
      expect.arrayContaining([
        "Form does not have an Url, In case of Helsenorge this field must be 'Questionnaire/<Id>'",
      ]),
    );
  });

  it("Metadata has no validatation errors", () => {
    const treeState = {
      qMetadata: {
        title: "Test",
        id: "1",
        name: "Test",
        url: "Questionnaire/1",
      },
    } as TreeState;

    const validationErrors = validateMetadata(translatationMock, treeState);

    expect(validationErrors.length).toBe(0);
  });

  describe("Title Validation", () => {
    it("when does not given", () => {
      const metadata = {
        id: "1",
        name: "Test",
        url: "Questionnaire/1",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.title,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Form does not have a title"],
      ]);
    });

    it("when used forbidden characters", () => {
      const metadata = {
        id: "1",
        name: "Test",
        url: "Questionnaire/1",
        title: "<Test>",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.title,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Title cannot have any special characters []{}/\\<>`´;:|\"'$£#@%*¤"],
      ]);
    });
  });

  describe("Technical Name Validation", () => {
    it("when does not given", () => {
      const metadata = {
        id: "1",
        title: "Test",
        url: "Questionnaire/1",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.name,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Form does not have a technical name"],
      ]);
    });
  });

  describe("Url Validation", () => {
    it("when does not given", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls).toEqual([
        [
          "Form does not have an Url, In case of Helsenorge this field must be 'Questionnaire/<Id>'",
        ],
      ]);
    });

    it("when url given but not starting with Questionnaire/", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
        url: "Test",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.warning);
      expect(translatationMock.mock.calls).toEqual([
        ["In case of Helsenorge this field must be 'Questionnaire/<Id>'"],
      ]);
    });

    it("when url given but not starting with Questionnaire/", () => {
      const metadata = {
        id: "1",
        title: "Test",
        name: "Test",
        url: "Questionnaire/104",
      } as IQuestionnaireMetadata;
      const treeState = { qMetadata: metadata } as TreeState;

      const validationErrors = validateMetadata(translatationMock, treeState);
      const titleError = validationErrors.filter(
        (f) => f.errorProperty === IQuestionnaireMetadataType.url,
      );

      expect(titleError.length).toBe(1);
      expect(titleError[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls).toEqual([
        ["Url must be 'Questionnaire/<Id>'"],
      ]);
    });
  });
});
