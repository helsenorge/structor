import { getInitialState } from "../initialState";

describe("initialState", () => {
  describe("getInitialState", () => {
    it("gets a new Id", () => {
      const state = getInitialState(false);

      expect(state.qMetadata.id).not.empty;
    });

    it("sets a url", () => {
      const state = getInitialState(false);

      expect(state.qMetadata.url?.startsWith("Questionnaire/")).toBeTruthy();
    });

    it("id in url is questionnaire's id", () => {
      const state = getInitialState(false);
      const utlSplitted = state.qMetadata.url?.split("/");

      expect(utlSplitted?.[1]).toEqual(state.qMetadata.id);
    });

    it("reset questionnaire gets url with correct id", () => {
      const state = getInitialState(true);
      const utlSplitted = state.qMetadata.url?.split("/");

      expect(utlSplitted?.[1]).toEqual(state.qMetadata.id);
    });
  });
});
