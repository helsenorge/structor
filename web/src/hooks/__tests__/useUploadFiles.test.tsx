import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../tests/testUtils";
import userEvent from "@testing-library/user-event";
import { useUploadFile } from "../useUploadFile";
import { mapToTreeState } from "src/helpers/FhirToTreeStateMapper";
import { saveQuestionnaire } from "src/store/treeStore/indexedDbHelper";
import { resetQuestionnaireAction } from "src/store/treeStore/treeActions";
import { getInitialState } from "src/store/treeStore/initialState";

// ——— mocks ———
vi.mock("src/helpers/FhirToTreeStateMapper");
vi.mock("src/store/treeStore/indexedDbHelper");
vi.mock("src/store/treeStore/treeActions");

const partialState = { foo: "bar", qMetadata: { id: "new-id" } };
(mapToTreeState as Mock).mockReturnValue(partialState);

// ——— test‐only harness component ———
const Harness = ({ onComplete }: { onComplete?: (id: string) => void }) => {
  const { uploadFile, isLoading, uploadRef, error } = useUploadFile({
    onUploadComplete: onComplete,
  });
  return (
    <>
      <input
        data-testid="file-input"
        ref={uploadRef}
        type="file"
        onChange={uploadFile}
      />
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error ?? ""}</div>
    </>
  );
};

describe("useUploadFile", () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
  });

  it("successfully imports a well‑formed JSON file", async () => {
    const onUploadComplete = vi.fn();
    render(<Harness onComplete={onUploadComplete} />, { dispatch });

    // create a valid JSON file
    const payload = { some: "data" };
    const file = new File([JSON.stringify(payload)], "questionnaire.json", {
      type: "application/json",
    });
    (file as any).text = () => Promise.resolve(JSON.stringify(payload));

    await userEvent.upload(screen.getByTestId("file-input"), file);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        resetQuestionnaireAction({ ...getInitialState(), isEdited: true }),
      );
      expect(saveQuestionnaire).toHaveBeenCalledWith({
        ...partialState,
        isEdited: true,
      });
      expect(onUploadComplete).toHaveBeenCalledWith("new-id");
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("error").textContent).toBe("");
    });
  });

  it("sets error state if JSON.parse throws", async () => {
    render(<Harness />, { dispatch });

    const bad = new File(["not json"], "bad.json", {
      type: "application/json",
    });

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    await userEvent.upload(screen.getByTestId("file-input"), bad);

    await waitFor(() => {
      expect(dispatch).not.toHaveBeenCalled();
      expect(saveQuestionnaire).not.toHaveBeenCalled();
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId("error").textContent).toBe(
        "Failed to import questionnaire. Please check the file format.",
      );
    });

    spy.mockRestore();
  });

  it("does nothing when no file is selected", () => {
    render(<Harness />, { dispatch });

    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [] },
    });

    expect(dispatch).not.toHaveBeenCalled();
    expect(saveQuestionnaire).not.toHaveBeenCalled();
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("");
  });
  it("handles saveQuestionnaire throwing", async () => {
    const payload = { some: "data" };
    const file = new File([JSON.stringify(payload)], "q.json", {
      type: "application/json",
    });
    (file as any).text = () => Promise.resolve(JSON.stringify(payload));

    (saveQuestionnaire as Mock).mockRejectedValueOnce(new Error("db fail"));

    const onUploadComplete = vi.fn();
    render(<Harness onComplete={onUploadComplete} />, { dispatch });

    await userEvent.upload(screen.getByTestId("file-input"), file);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        resetQuestionnaireAction({ ...getInitialState(), isEdited: true }),
      );
      expect(onUploadComplete).not.toHaveBeenCalled();
      expect(screen.getByTestId("error").textContent).toBe(
        "Failed to import questionnaire. Please check the file format.",
      );
      expect(screen.getByTestId<HTMLInputElement>("file-input").value).toBe("");
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });
  it("does not call onUploadComplete if qMetadata.id is falsy", async () => {
    const payload = { foo: "bar" };
    const file = new File([JSON.stringify(payload)], "q.json", {
      type: "application/json",
    });
    (file as any).text = () => Promise.resolve(JSON.stringify(payload));
    const onUploadComplete = vi.fn();

    (mapToTreeState as Mock).mockReturnValue({
      foo: "bar",
      qMetadata: { id: undefined },
    });

    render(<Harness onComplete={onUploadComplete} />, { dispatch });
    await userEvent.upload(screen.getByTestId("file-input"), file);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalled();
      expect(saveQuestionnaire).toHaveBeenCalled();
      expect(onUploadComplete).not.toHaveBeenCalled();
      expect(screen.getByTestId("error").textContent).toBe("");
    });
  });

  it("works even without onUploadComplete", async () => {
    const payload = { foo: "bar" };
    const file = new File([JSON.stringify(payload)], "ok.json", {
      type: "application/json",
    });
    (file as any).text = () => Promise.resolve(JSON.stringify(payload));

    (mapToTreeState as Mock).mockReturnValue(partialState);

    render(<Harness />, { dispatch });
    await userEvent.upload(screen.getByTestId("file-input"), file);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        resetQuestionnaireAction({ ...getInitialState(), isEdited: true }),
      );
      expect(saveQuestionnaire).toHaveBeenCalledWith({
        ...partialState,
        isEdited: true,
      });
      expect(screen.getByTestId("error").textContent).toBe("");
      expect(screen.getByTestId("loading").textContent).toBe("false");
      expect(screen.getByTestId<HTMLInputElement>("file-input").value).toBe("");
    });
  });

  it("clears the file input after a successful upload", async () => {
    const payload = { baz: "qux" };
    const file = new File([JSON.stringify(payload)], "good.json", {
      type: "application/json",
    });
    (file as any).text = () => Promise.resolve(JSON.stringify(payload));
    (mapToTreeState as Mock).mockReturnValue(partialState);

    render(<Harness />, { dispatch });
    const input = screen.getByTestId<HTMLInputElement>("file-input");
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
