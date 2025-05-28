import { ErrorLevel } from "../../validationTypes";
import { validateBundle } from "../bundleValidation";
import { q5 } from "./data";

const bundle = q5;

describe("bundleValidation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("Id Validation", () => {
    it("Should get error if bundle has questionnaires with same id", () => {
      const validationErrors = validateBundle(translatationMock, bundle);

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          "One or more questionnaires in bundle has the same id",
        ]),
      );
    });
  });
});
